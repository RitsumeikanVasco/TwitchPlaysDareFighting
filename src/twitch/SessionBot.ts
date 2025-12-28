import { initiateBot } from "../functions/initiateBot"
import tmi from "tmi.js"
import bot_keys from "./../../bot_keys.json"
import {getChatters} from "./../functions/getChatters"
import { EventEmitter } from "events";
import Config from "./../Config.json"
import {getUsernameFromId} from "../functions/getUsernameFromId"

import {getBotKeys, setBotKeys, BotKeys} from "./../Database/index"


const UPDATE_RATE_SECONDS = 10
const WELCOME_WHISPER = "Welcome to the Stream!"

let usernameToId: Map<string, string> = new Map()
let playerSessions: Map<string, string> = new Map()
let sessionsEmitter = new EventEmitter()

function checkPlayerJoined(playerId: string, username: string){
    if (playerSessions.has(playerId))
        return

    usernameToId.set(username, playerId)
    playerSessions.set(playerId, username)
    sessionsEmitter.emit("Join", playerId, username)
}

function checkPlayerLeft(playerId: string){
    if (!playerSessions.has(playerId))
        return

    let username: string = playerSessions.get(playerId) as string
    usernameToId.delete(username)
    playerSessions.delete(playerId)
    sessionsEmitter.emit("Leave", playerId, username)
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function cacheChatUsers(){
    const chatters = await getChatters() // array of { user_id, user_login, user_name }
    const currentUserIds = chatters.map(u => u.user_id)
    let botKeys: BotKeys | null = await getBotKeys(bot_keys.twitchPlaysBot)

    if (!botKeys)
        return

    currentUserIds.forEach(async userId => {
        let userName: string = await getUsernameFromId(userId, botKeys.access_token, botKeys.client_id)

        checkPlayerJoined(userId, userName)
    })

    Array.from(playerSessions.keys()).forEach(userId => {
        if (!currentUserIds.includes(userId)) {
            checkPlayerLeft(userId)
        }
    })
}

async function loop() {
    while (true) {
        await sleep(UPDATE_RATE_SECONDS * 1000);
        // await cacheChatUsers()
    }
}

/*
    Can connect to the sessions emitters with the following code:

    ``js
    sessionsEmitter.on("Join", (playerId)=>{
        console.log("Join", playerId)
    })

    sessionsEmitter.on("Leave", (playerId)=>{
        console.log("Leave", playerId)
    })
    ``
*/
export function getSessionsEmitter(){
    return sessionsEmitter
}

export function getUserIdFromUsername(username: string): string | null{
    return usernameToId.get(username) || null
}

export function getUsernameFromUserId(userid: string): string | null{
    return playerSessions.get(userid) || null
}

export function getSessionUsers(): Map<string, string> {
    return playerSessions
}

export async function initSessionBot(){
    const twitchClient: tmi.Client | null = await initiateBot(bot_keys.twitchPlaysBot, Config.target_channel)

    if (!twitchClient)
        return

    twitchClient.on("whisper", (from: string, userstate: tmi.ChatUserstate, message: string, self: boolean) =>{
        console.log(`[Whisper]: ${message}`)
        sessionsEmitter.emit("Whisper", userstate, message)
    })

    // Send Welcome message
    sessionsEmitter.on("Join", (_, username: string) => {
        twitchClient.whisper(username as string, WELCOME_WHISPER)
    })

    twitchClient.on('message', async (_channel: string, tags: tmi.ChatUserstate, _message: string, self: boolean) => {
        let userId: string = tags["user-id"] as string

        if (self)
            return

        if (userId == undefined)
            return

        checkPlayerJoined(userId, tags.username as string)
    })

    cacheChatUsers()
    loop()

    sessionsEmitter.on("Join", (playerId)=>{
        console.log("Join", playerId)
    })

    sessionsEmitter.on("Leave", (playerId)=>{
        console.log("Leave", playerId)
    })
}