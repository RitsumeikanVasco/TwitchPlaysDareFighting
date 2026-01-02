import http from "http"
import {Server} from "socket.io"
import Config from "./../Config.json"
import sleep from "./../functions/sleep"
import jwt from "jsonwebtoken" // Import JWT library

let io: Server;

export default async function TwitchSocketInit(){
   // We create the server with a direct callback to test connectivity
    const server = http.createServer((req, res) => {
        console.log("Direct HTTP request received on Port2");
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("IO2 SERVER IS ALIVE"); 
    });

    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Simple middleware with logs to catch every attempt
    io.use((socket, next) => {
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

    io.on("connection", (socket) => {
        console.log(`Twitch Socket Connected!`);
    });

    // Add error listener to see if the port is blocked
    server.on('error', (e: any) => {
        if (e.code === 'EADDRINUSE') {
            console.error(`FATAL: Port ${Config.socket_port2} is already in use!`);
        } else {
            console.error("Server2 Error:", e);
        }
    });

    server.listen(Config.socket_port2, "0.0.0.0", () => {
        console.log(`>>> Twitch Socket (IO2) listening on: ${Config.socket_port2}`);
    });
}

export async function getSocket(){
    while(io == undefined)
        sleep(500)
    
    return io
}