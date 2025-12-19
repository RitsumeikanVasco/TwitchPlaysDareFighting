import tmi from "tmi.js"
import fs from "fs"
import path from "path"
import {refreshAccessToken} from "./../functions/refreshAccessToken"
import _botkeys from "./../bot_keys.json" // This is to force file inclusion compilation

interface BotKeys {
    key: string;
    username: string;
    refresh_token: string;
    access_token: string;
    client_id: string;
    client_secret: string;
}

const JSON_PATH: string = path.join(__dirname, "..", "bot_keys.json")
const TWITCH_CLIENTS: Map<string, tmi.Client> = new Map()

export function initiateBot(botUsername: string, targetChannelName: string): tmi.Client | null {
    if (TWITCH_CLIENTS.has(botUsername)){
        let existingTwitchClient: tmi.Client = TWITCH_CLIENTS.get(botUsername) as tmi.Client

        return existingTwitchClient
    }

    let file = fs.readFileSync(JSON_PATH, 'utf8')
    let jsonObject = JSON.parse(file)
    let botKeys: BotKeys = jsonObject[botUsername]

    if (
        !botKeys || 
        !botKeys.access_token ||
        !botKeys.client_id ||
        !botKeys.client_secret ||
        !botKeys.refresh_token
    ){
        console.warn(`There's no keys for a bot with the username of ${botUsername}`)
        return null
    }

    refreshAccessToken(botKeys.client_id, botKeys.client_secret, botKeys.refresh_token)

    return null
    /*
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
    */

}