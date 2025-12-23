import tmi from "tmi.js"
import {refreshAccessToken, RefreshResponseData} from "./refreshAccessToken"
import bot_keys from "../../bot_keys.json" // This is to force file inclusion compilation
import {getBotKeys, setBotKeys, BotKeys} from "./../Database/index"

const TWITCH_CLIENTS: Map<string, tmi.Client> = new Map()

export async function initiateBot(botUsername: string, targetChannelName: string): Promise<tmi.Client | null> {
    if (TWITCH_CLIENTS.has(botUsername)){
        let existingTwitchClient: tmi.Client = TWITCH_CLIENTS.get(botUsername) as tmi.Client

        return existingTwitchClient
    }

    let botKeys: BotKeys | null = await getBotKeys(bot_keys.twitchPlaysBot)
    
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

    setBotKeys(bot_keys.twitchPlaysBot, botKeys)

    let twitchClient = new tmi.Client({
        channels: [ targetChannelName ],
        identity: {
            username: botKeys.username,
            password: `oauth:${botKeys.access_token}`
        },        
    })

    try {
        TWITCH_CLIENTS.set(botUsername, twitchClient)
        await twitchClient.connect()
        console.log(`Successfully connected ${botUsername} to ${targetChannelName}`);
        return twitchClient;
    } catch (err) {
        // If the error is "Login unsuccessful", we catch it here
        console.error(`Failed to connect bot ${botUsername}:`, err);
        
        // Clean up the map if connection fails
        TWITCH_CLIENTS.delete(botUsername);
        return null;
    }
}