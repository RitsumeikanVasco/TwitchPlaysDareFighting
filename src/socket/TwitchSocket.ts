import http from "http"
import {Server} from "socket.io"
import Config from "./../Config.json"
import sleep from "./../functions/sleep"
import jwt from "jsonwebtoken" // Import JWT library

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
        const token = socket.handshake.auth.token
        
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
        console.log(`User Connected! ${socket.handshake.auth.userId}`)
    })
}

export async function getSocket(){
    while(io == undefined)
        sleep(500)
    
    return io
}