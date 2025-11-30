import http from "http"
import {Server} from "socket.io"
import Config from "./../Config.json"

export async function socketInit(){
    const server = http.createServer();
    const io = new Server(server);

    //Initiate the server on the socket port
    server.listen(Config.socket_port, ()=>{
        console.log(`Listening on Port ${Config.socket_port}`)
    })

    io.on("connection", (socket) => {
        console.log("Client connected");
    });
}