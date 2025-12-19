import { initiateBot } from "./initiateBot"
import tmi from "tmi.js"
import {getChatters} from "./../functions/getChatters"
import { EventEmitter } from "events";

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
        await cacheChatUsers()
    }
}

export async function initSessionBot(){
    const twitchClient: tmi.Client | null = initiateBot()

    if (!twitchClient)
        return

    twitchClient.on('message', (_channel: string, tags: tmi.ChatUserstate, _message: string, self: boolean) => {
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