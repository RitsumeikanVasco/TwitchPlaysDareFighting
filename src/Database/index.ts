import mongoose from "mongoose"
import PlayerData from "./schemas/PlayerData"
import Config from "./../Config.json"
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export interface BotKeys {
    username: string;
    refresh_token: string;
    access_token: string;
    client_id: string;
    client_secret: string;
}

let BOT_KEYS: Map<string, BotKeys> = new Map()

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB Server ✅");
})

let playerDataModel;
let supabase: SupabaseClient;

export function getSupabase(): SupabaseClient{
    return supabase
}

export async function getBotKeys(botUsername: string): Promise<BotKeys | null>{
    if (BOT_KEYS.has(botUsername)){
        return BOT_KEYS.get(botUsername) || null;
    }

    const { data, error } = await supabase
        .from('bot_tokens')
        .select('*')
        .eq('username', botUsername)
        .single(); // Returns the object directly, not an array

    if (error) {
        console.error('Error fetching bot:', error.message)
        return null
    }

    BOT_KEYS.set(botUsername, data)

    return data
}

export async function setBotKeys(botUserName: string, botKeys: BotKeys){
    let currentBotKeys: BotKeys | null = await getBotKeys(botUserName)

    if (currentBotKeys){
        Object.keys(currentBotKeys).forEach((key: string) => {
            const typedKey = key as keyof BotKeys;

            if (botKeys[typedKey])
                currentBotKeys[typedKey] = botKeys[typedKey]
        })

        BOT_KEYS.set(botUserName, currentBotKeys)
    }

    await supabase
    .from('bot_tokens')
    .update(botKeys)
    .eq('username', botUserName)
}

export async function databaseInit(){
    console.log("Database Init")
    await mongoose.connect(`mongodb://127.0.0.1:${Config.database_port}/${Config.database_name}`);
    playerDataModel = mongoose.model("PlayerData", PlayerData)

    supabase = createClient("https://kkogokcphyhvdftbxsyw.supabase.co", "sb_publishable_u8YlTvC2gaQ1Np38aB6gxA_TPJSMdMJ")
} 