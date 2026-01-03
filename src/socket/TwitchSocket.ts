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
        
        const cleanUserId = auth.userId.startsWith('U') 
            ? auth.userId.substring(1) 
            : auth.userId;

        socket.handshake.auth.userId = cleanUserId

        if (token === "mock_jwt_token") 
            return next()

        const secret = Buffer.from(Config.extension_secret, 'base64')

        jwt.verify(token, secret, (err: any, decoded: any) => {
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
        const id = auth.userId

        function updateValues(){
            socket.emit("updatedValues", getPoints(id))
        }

        databaseEmitter.on("Join", (userId)=>{
            if (id != userId)
                return

            updateValues()
        })

        databaseEmitter.on("ValueChanged", (userid =>{
            console.log("valued changed > 1")
            if (id != userid)
                return
            console.log("valued changed > 2")
            updateValues()
        }))

        socket.on("getPoints", (callback)=>{
            callback(getPoints(id))
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