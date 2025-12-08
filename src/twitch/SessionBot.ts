import { createBot } from "./createBot"
import tmi from "tmi.js"

let playerSessions = new Map()

function checkPlayerJoined(playerId: string){

}

function checkPlayerLeft(playerId: string){

}

export function initSessionBot(){
    const twitchClient: tmi.Client = createBot()

    twitchClient.on('message', (_channel: string, tags: tmi.ChatUserstate, _message: string, self: boolean) => {
        if (self)
            return

        let userId: string | undefined = tags.id

        if (userId == undefined)
            return

        checkPlayerJoined(userId)
    })
}