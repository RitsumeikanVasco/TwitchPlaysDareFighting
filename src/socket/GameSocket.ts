import http from "http"
import {Server} from "socket.io"
import Config from "./../Config.json"
import sleep from "./../functions/sleep"

const CONNECTION_MESSAGE: string = "Client connected"

let io: Server;

export default async function GameSocketInit(){
    const server = http.createServer()
    io = new Server(server)

    io.on("connection", (_socket) => {
        console.log(CONNECTION_MESSAGE);
    });

    //Initiate the server on the socket port
    server.listen(Config.socket_port, ()=>{
        console.log(`Listening on Port ${Config.socket_port}`)
    })
}

export async function getSocket(){
    while(io == undefined)
        sleep(500)
    
    return io
}