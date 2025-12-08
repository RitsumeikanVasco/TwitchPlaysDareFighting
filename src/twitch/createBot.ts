import tmi from "tmi.js"

let twitchClient: tmi.Client | null = null;

export function createBot(){
    if (twitchClient != null)
        return twitchClient

    let channelToListenUsername: string = process.env.CHANNEL_NAME as string

    twitchClient = new tmi.Client({
        channels: [ channelToListenUsername ],
        identity: {
            username: process.env.BOT_USERNAME,
            password: process.env.BOT_TOKEN
        },        
    })

    return twitchClient
}