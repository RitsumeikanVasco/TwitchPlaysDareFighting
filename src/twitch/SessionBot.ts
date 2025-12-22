import { initiateBot } from "../functions/initiateBot"
import tmi from "tmi.js"
import bot_keys from "./../../bot_keys.json"
import {getChatters} from "./../functions/getChatters"
import { EventEmitter } from "events";
import Config from "./../Config.json"

const UPDATE_RATE_SECONDS = 10

let playerSessions = new Map()

let sessionsEmitter = new EventEmitter()

function checkPlayerJoined(playerId: string){
    if (playerSessions.has(playerId))
        return

    playerSessions.set(playerId, Date.now())
    sessionsEmitter.emit("Join", playerId)
}

function checkPlayerLeft(playerId: string){
    if (!playerSessions.has(playerId))
        return

    playerSessions.delete(playerId)
    sessionsEmitter.emit("Leave", playerId)
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function cacheChatUsers(){
    const chatters = await getChatters() // array of { user_id, user_login, user_name }
    const currentUserIds = chatters.map(u => u.user_id)

    currentUserIds.forEach(userId => {
        checkPlayerJoined(userId)
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

export async function initSessionBot(){
    const twitchClient: tmi.Client | null = await initiateBot(bot_keys.twitchPlaysBot, Config.target_channel)

    if (!twitchClient)
        return

    twitchClient.on('message', (_channel: string, tags: tmi.ChatUserstate, _message: string, self: boolean) => {
        console.log(`Message: ${_message}`)
        if (self)
            return

        let userId: string | undefined = tags["user-id"]

        if (userId == undefined)
            return

        checkPlayerJoined(userId)
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