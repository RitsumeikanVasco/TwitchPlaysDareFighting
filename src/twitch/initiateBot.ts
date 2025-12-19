import tmi from "tmi.js"
import fs from "fs"
import path from "path"
import {refreshAccessToken, RefreshResponseData} from "./../functions/refreshAccessToken"
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

export async function initiateBot(botUsername: string, targetChannelName: string): Promise<tmi.Client | null> {
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

    let refreshResponse: RefreshResponseData = await refreshAccessToken(botKeys.client_id, botKeys.client_secret, botKeys.refresh_token)
    botKeys.access_token = refreshResponse.access_token
    botKeys.refresh_token = refreshResponse.refresh_token

    await fs.writeFileSync(JSON_PATH, JSON.stringify(jsonObject))

    let twitchClient = new tmi.Client({
        channels: [ targetChannelName ],
        identity: {
            username: botKeys.username,
            password: `oauth:${botKeys.access_token}`
        },        
    })

    TWITCH_CLIENTS.set(botUsername, twitchClient)
    twitchClient.connect()

    return twitchClient
}