import http from "http"
import {Server} from "socket.io"
import Config from "./../Config.json"
import sleep from "./../functions/sleep"
import {getPlayersFromTeam} from "./../services/TeamService"
import {givePoints} from "./../services/PointService"
import Team from "./../enums/Team"
import {shopEmitter} from "./../services/ShopService"
import ShopItems from "./../enums/ShopItems"
import {getTeam} from "./../services/TeamService"
import {roundEmitter} from "./../services/RoundService"

const CONNECTION_MESSAGE: string = "Client connected"
const POINTS_PER_WIN: number = 50

let io: Server;

export default async function GameSocketInit(){
    const server = http.createServer()
    io = new Server(server)

    io.on("connection", (socket) => {
        console.log(CONNECTION_MESSAGE);

        socket.on("RoundFinished", (winner: Team, round: number)=>{
            getPlayersFromTeam(winner).forEach((value: string)=>{
                givePoints(value, POINTS_PER_WIN)
            })

            roundEmitter.emit("RoundFinished", winner, round)
        })

        shopEmitter.on("purchasedItem", (userid: string, itemid: string)=>{
            let team: Team = getTeam(userid) as Team

            switch(itemid){
                case ShopItems.Health10:
                    socket.emit("Heal", team, 10)
                    break;
                case ShopItems.Health50:
                    socket.emit("Heal", team, 50)
                    break;
                case ShopItems.Health100:
                    socket.emit("Heal", team, 100)
                    break;
            }
        })
    })

    //Initiate the server on the socket port
    server.listen(Config.socket_game_port, ()=>{
        console.log(`[Game Socket] Listening on Port ${Config.socket_game_port}`)
    })
}

export async function getSocket(){
    while(io == undefined)
        sleep(500)
    
    return io
}