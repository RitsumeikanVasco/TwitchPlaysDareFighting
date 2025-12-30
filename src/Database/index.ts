import mongoose, { mongo } from "mongoose"
import PlayerData from "./schemas/PlayerData"
import Config from "./../Config.json"
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import {sessionsEmitter, playerSessions} from "../twitch/SessionBot"
import { EventEmitter } from "events";

type PlayerData = {
    _id: { 
        type: String, 
        required: true 
    },
    points: {
        type: Number,
        required: true,
        default: 0
    },
}

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

type PlayerDataModel = mongoose.Model<{ points: number; _id: string }, {}, {}, { id: string; }, mongoose.Document<unknown, {}, { points: number; }, { id: string; }, mongoose.DefaultSchemaOptions>>

let playerDataModel: PlayerDataModel;
let supabase: SupabaseClient;

export let playersData: Map<string, mongoose.Document<PlayerData>> = new Map()
export let databaseEmitter = new EventEmitter()

// Join and Leave logic
async function playerJoin(userid: string){
    if(playersData.has(userid))
        return

    let player: mongoose.Document<PlayerData> = await playerDataModel.findOneAndUpdate(
        {_id: userid},
        {},
        { 
            upsert: true,            // 3. Create if it doesn't exist
            new: true,               // 4. Return the updated/new document
            setDefaultsOnInsert: true // 5. Apply schema defaults
        }
    )
    
    playersData.set(userid, player)
    databaseEmitter.emit("Join", userid, player)
}

function playerLeft(userid: string){
    if(!playersData.has(userid))
        return

    let playerData = playersData.get(userid)
    playersData.delete(userid)
    databaseEmitter.emit("Leave", userid, playerData)
}

function sessionInit(){
    sessionsEmitter.on("Join", (userid) => {
        playerJoin(userid)
    })

    sessionsEmitter.on("Leave", (userid) => {
        playerLeft(userid)
    })

    playerSessions.forEach((_, userid) => {
        playerJoin(userid)
    })
}
///////////////

// Utility Methods
export function has(userid: string, index: string): boolean {
    if (!playersData.has(userid))
        return false

    let value = playersData.get(userid)?.get(index) || null

    return value != null
}

export function get(userid: string, index: string): any {
    if (!has(userid, index))
        return null

    return playersData.get(userid)?.get(index)
}

export function set(userid: string, index: string, newValue: any){
    let currentValue: any | null = get(userid, index)

    if (currentValue == null || currentValue == newValue)
        return // nothing to update

    let playerDocument: mongoose.Document<PlayerData> = playersData.get(userid) as mongoose.Document<PlayerData>
    playerDocument.set(index, newValue)
    playerDocument.save()
    databaseEmitter.emit("ValueChanged", userid, index, newValue) // trigger for changes
}
//////////////////

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

    sessionInit()

    supabase = createClient("https://kkogokcphyhvdftbxsyw.supabase.co", "sb_publishable_u8YlTvC2gaQ1Np38aB6gxA_TPJSMdMJ")
} 