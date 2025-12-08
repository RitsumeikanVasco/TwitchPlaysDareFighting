import {getToken} from "./../functions/getToken"
import tmi from "tmi.js"
import { createBot } from "./createBot"
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
    let token: TokenResponse = await getToken()

    console.log(token)
    // let accessToken: string = token.access_token
    const twitchClient: tmi.Client = createBot()

    SessionBot.initSessionBot()
    twitchClient.connect()
}