import { createBot } from "./createBot"
import tmi from "tmi.js"
import API from "./../API.json"
import {getChatters} from "./../functions/getChatters"
import axios from "axios"

let playerSessions = new Map()

function checkPlayerJoined(playerId: string){
    playerSessions.set(playerId, Date.now())
}

function checkPlayerLeft(playerId: string){

}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loop() {
    while (true) {
        console.log("Every 5 seconds");
        await sleep(5000);
    }
}



export async function initSessionBot(){
    const twitchClient: tmi.Client = createBot()

    twitchClient.on('message', (_channel: string, tags: tmi.ChatUserstate, _message: string, self: boolean) => {
        if (self)
            return

        let userId: string | undefined = tags.id

        if (userId == undefined)
            return

        checkPlayerJoined(userId)
        //loop()
    })

    console.log(await getChatters())
}