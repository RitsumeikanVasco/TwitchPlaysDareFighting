import {getToken} from "./../functions/getToken"
import tmi from "tmi.js"

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

    })
    
    twitchClient.connect()
}