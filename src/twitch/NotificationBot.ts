import { initiateBot } from "../functions/initiateBot"
import tmi from "tmi.js"
import bot_keys from "./../../bot_keys.json"
import Config from "./../Config.json"

export async function initNotificationBot(){
    const twitchClient: tmi.Client | null = await initiateBot(bot_keys.twitchPlaysBot, Config.target_channel)

    if (!twitchClient)
        return

    twitchClient.say(Config.target_channel, "Hello World")
}