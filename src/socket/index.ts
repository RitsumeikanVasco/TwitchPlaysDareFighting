import http from "http"
import {Server} from "socket.io"
import Config from "./../Config.json"

const CONNECTION_MESSAGE: string = "Client connected"

let io: Server

export async function socketInit(){
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
    return io
}