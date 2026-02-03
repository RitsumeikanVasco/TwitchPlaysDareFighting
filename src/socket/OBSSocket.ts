import {Server} from "socket.io"
import http from "http"
import Config from "./../Config.json"
import {TimeTick, clock} from "./../services/VoteService"
import {getTeamCount, teamEmitter} from "./../services/TeamService"
import Team from "./../enums/Team"

let io: Server;

export default function Init(){
    const server = http.createServer((_req, res) => { // default fallback
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end("IO2 SERVER IS ALIVE")
    })

    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        }
    })

    server.listen(Config.socket_obs_port, "0.0.0.0", () => {
        console.log(`[Twitch Socket] listening on port: ${Config.socket_obs_port}`)
    })

    io.on("connection", (socket) => {
         /* Timer Connections */
        socket.on("getTimer", (callback)=>{
            if (!clock)
                callback(0)
            else
                callback(clock.getCurrentSeconds())
        })

        TimeTick.Connect((currentTimeLeft: number) => {
            socket.emit("timerUpdated", currentTimeLeft)
        })

        socket.on("getTeamCount", (callback)=>{
            callback({
                team1Count: getTeamCount(Team.P1),
                team2Count: getTeamCount(Team.P2)
            })
        })

        function teamCountsChanged(){
            socket.emit("teamCountsChanged",  {
                team1Count:getTeamCount(Team.P1),
                team2Count:getTeamCount(Team.P2)
            })
        }

        teamEmitter.on("JoinedTeam", teamCountsChanged)
        teamEmitter.on("LeftTeam", teamCountsChanged)
    })
}