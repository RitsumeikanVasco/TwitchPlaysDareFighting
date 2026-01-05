import http from "http"
import {Server} from "socket.io"
import Config from "./../Config.json"
import sleep from "./../functions/sleep"
import jwt from "jsonwebtoken" // Import JWT library
import {databaseEmitter} from "../Database/index"
import {getPoints, givePoints} from "../services/PointService"
import {checkPlayerJoined} from "../twitch/SessionBot"
import {getUsernameFromId} from "../functions/getUsernameFromId"
import bot_keys from "./../../bot_keys.json"
import {getBotKeys, setBotKeys, BotKeys} from "./../Database/index"
import {PurchaseItem} from "./../services/ShopService"

// Votes
import {castVote, castedVote, votesEmitter} from "./../services/VoteService"
import Action from "./../enums/Action"
// Teams
import {setTeam, getTeam, getTeamCount, teamEmitter} from "./../services/TeamService"
import Team from "./../enums/Team"

type auth = {
    token: string,
    channelId: string,
    userId: string
}

let io: Server;

export default async function TwitchSocketInit(){
    const server = http.createServer((_req, res) => { // default fallback
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end("IO2 SERVER IS ALIVE")
    });

    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        }
    })

    io.use((socket, next) => {
        const auth = socket.handshake.auth
        const token = socket.handshake.auth.token
        
        if (!auth || !auth.userId || !auth.token) {
                console.error("Connection rejected: Missing auth credentials");
                return next(new Error("Missing Auth"));
        }

        const cleanUserId = auth.userId.startsWith('U') 
            ? auth.userId.substring(1) 
            : auth.userId;

        socket.handshake.auth.userId = cleanUserId

        if (token === "mock_jwt_token") 
            return next()

        const secret = Buffer.from(Config.extension_secret, 'base64')

        jwt.verify(token, secret, { clockTolerance: 10 }, (err: any, decoded: any) => {
            if (err) {
                console.log("JWT Fail:", err.message)
                return next(new Error("Auth Error"))
            }
            socket.data.user_id = decoded.user_id
            next();
        });
    });

    // Add error listener to see if the port is blocked
    server.on('error', (e: any) => {
        if (e.code === 'EADDRINUSE')
            console.error(`FATAL: Port ${Config.socket_twitch_port} is already in use!`)
        else
            console.error("Server2 Error:", e)
    })

    server.listen(Config.socket_twitch_port, "0.0.0.0", () => {
        console.log(`[Twitch Socket] listening on port: ${Config.socket_twitch_port}`)
    })

    io.on("connection", (socket) => {
        const auth: auth = socket.handshake.auth as auth
        const id: string = auth.userId

        /* Points Connections */
        function updateValues(){
            socket.emit("updatedValues", getPoints(id))
        }

        databaseEmitter.on("Join", (userId)=>{
            if (id != userId)
                return

            updateValues()
        })

        databaseEmitter.on("ValueChanged", (userid =>{
            if (id != userid)
                return

            updateValues()
        }))

        socket.on("getPoints", (callback)=>{
            callback(getPoints(id))
        })

        /* Votes Connections */
        function resetVote(){
            socket.emit("voteReset")
        }

        function voted(){
            socket.emit("voted")
        }

        votesEmitter.on("CastedVote", (userid)=>{
            if (userid == id)
                voted()
        })

        votesEmitter.on("VotesReset", ()=>{
            resetVote()
        })

        socket.on("getVoted", (callback)=>{
            callback(castedVote(id))
        })

        /* Attack Connections */
        socket.on("voteAttack", (attackId: string) => {
           castVote(id, attackId as Action)
        })

        /* Shop Connections */
        socket.on("purchaseItem", (itemId: string) => {
            PurchaseItem(id, itemId)
        })

        /* Team Connections */
        socket.on("getTeamsCount", (callback)=>{
            callback({
                team1Count: getTeamCount(Team.P1),
                team2Count: getTeamCount(Team.P2)
            })
        })

        function teamCountsChanged(){
            socket.emit("teamCountsChanged", {
                team1Count: getTeamCount(Team.P1),
                team2Count: getTeamCount(Team.P2)
            })
        }

        teamEmitter.on("JoinedTeam", (userid, team) => {
            teamCountsChanged()

            if (userid == id)
                socket.emit("joinedTeam", team == Team.P1 ? 1 : 2)
        })

        teamEmitter.on("LeftTeam", (userid)=> {
            teamCountsChanged()

            if (userid == id)
                socket.emit("leftTeam")
        })

        socket.on("selectedTeam", (team)=>{
            if (team == 1){
                setTeam(id, Team.P1)
            }else{
                setTeam(id, Team.P2)
            }
        })

        socket.on("getTeam", (callback)=>{
            let team: Team | null = getTeam(id)

            if (team == Team.P1){
                callback(1)
            }else if (team == Team.P2){
                callback(2)
            }else {
                callback()
            }
        })

        // Update on player join as well
        new Promise(async (resolve, _reject) => {
            let botKeys: BotKeys | null = await getBotKeys(bot_keys.twitchPlaysBot)

            if (!botKeys)
                return

            getUsernameFromId(id, botKeys.access_token, botKeys.client_id).then((username)=>{
                checkPlayerJoined(id, username || "")
                resolve("")
            })
        })
 
        /* FOR TESTING PURPOSES
        setTimeout(async ()=>{
            while(true){
                await sleep(500)
                givePoints(id, 10)
            }
        }, 5000)
        */

        console.log(`User Connected! ${auth.userId}`)
    })
}

export async function getSocket(){
    while(io == undefined)
        sleep(500)
    
    return io
}