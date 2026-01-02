import http from "http"
import {Server} from "socket.io"
import Config from "./../Config.json"
import sleep from "./../functions/sleep"
import jwt from "jsonwebtoken" // Import JWT library

const CONNECTION_MESSAGE: string = "Client connected"

let io: Server;
let io2: Server
export async function socketInit2() {
    // We create the server with a direct callback to test connectivity
    const server2 = http.createServer((req, res) => {
        console.log("Direct HTTP request received on Port2");
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("IO2 SERVER IS ALIVE"); 
    });

    io2 = new Server(server2, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Simple middleware with logs to catch every attempt
    io2.use((socket, next) => {
        console.log("IO2 Connection Attempt...");
        const token = socket.handshake.auth.token;
        
        if (token === "mock_jwt_token") return next();

        const secret = Buffer.from(Config.extension_secret, 'base64');
        jwt.verify(token, secret, (err: any, decoded: any) => {
            if (err) {
                console.log("JWT Fail:", err.message);
                return next(new Error("Auth Error"));
            }
            socket.data.user_id = decoded.user_id;
            next();
        });
    });

    io2.on("connection", (socket) => {
        console.log(`Twitch Socket Connected!`);
    });

    // Add error listener to see if the port is blocked
    server2.on('error', (e: any) => {
        if (e.code === 'EADDRINUSE') {
            console.error(`FATAL: Port ${Config.socket_port2} is already in use!`);
        } else {
            console.error("Server2 Error:", e);
        }
    });

    server2.listen(Config.socket_port2, "0.0.0.0", () => {
        console.log(`>>> Twitch Socket (IO2) listening on: ${Config.socket_port2}`);
    });
}

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

    await socketInit2()
}

export async function getSocket(){
    while(io == undefined)
        sleep(500)
    
    return io
}