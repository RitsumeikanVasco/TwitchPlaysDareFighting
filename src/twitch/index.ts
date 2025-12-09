import {getToken} from "./../functions/getToken"
import tmi from "tmi.js"
import { createBot } from "./createBot"
import { getSocket } from "../socket"
import * as SessionBot from "./SessionBot"

// Types
import type { TokenResponse } from './../ChatTypes.js';

/*
twitchClient.on('message', (channel: string, tags: tmi.ChatUserstate, message: string, self: boolean) => {
    getSocket().then((socket)=>{
        socket.emit("Jump") // This calls jump in the Java code!
    })
})
*/
export async function twitchInit(){
    const twitchClient: tmi.Client = createBot()

    await SessionBot.initSessionBot()

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
                socket.emit("attack") // This calls punch in the Java code!
            })
        }

        if (message == "defence"){
            getSocket().then((socket)=>{
                socket.emit("defence") // This calls guard in the Java code!
            })
        }

        if (message == "other"){
            getSocket().then((socket)=>{
                socket.emit("other") // This calls jump in the Java code!
            })
        }
    })
    
    await twitchClient.connect()
}
