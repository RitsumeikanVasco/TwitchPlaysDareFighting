import {getToken} from "./../functions/getToken"
import tmi from "tmi.js"
import {getSocket} from "./../socket/index"

// Types
import type { TokenResponse } from './../ChatTypes.js';

export async function twitchInit(){
    let channelToListenUsername: string = process.env.CHANNEL_NAME as string
    let token: TokenResponse = await getToken()
    let accessToken: string = token.access_token

    const twitchClient = new tmi.Client({
        channels: [ channelToListenUsername ],
        identity: {
            username: process.env.BOT_USERNAME,
            password: process.env.BOT_TOKEN
        },        
    })

    // Called when you receive a message from Twitch
    twitchClient.on('message', (channel: string, tags: tmi.ChatUserstate, message: string, self: boolean) => {
        if (self)
            return

        if (message == "jump"){
            getSocket().then((socket)=>{
                socket.emit("jump") // This calls jump in the Java code!
            })
        }

        if (message == "attack"){
            getSocket().then((socket)=>{
                socket.emit("attack") // This calls jump in the Java code!
            })
        }

        if (message == "defence"){
            getSocket().then((socket)=>{
                socket.emit("defence") // This calls jump in the Java code!
            })
        }

        if (message == "other"){
            getSocket().then((socket)=>{
                socket.emit("other") // This calls jump in the Java code!
            })
        }
    })
    
    twitchClient.connect()
}
