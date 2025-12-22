import {getToken} from "./../functions/getToken"
import tmi from "tmi.js"
import { initiateBot } from "../functions/initiateBot"
import { getSocket } from "../socket"
import * as SessionBot from "./SessionBot"
import * as TeamBot from "./teamBot"

export async function twitchInit(){
    // await SessionBot.initSessionBot()
    // await TeamBot.startTeamBot()

    /*
        let twitchClient: tmi.Client;
    // Called when you receive a message from Twitch
    twitchClient.on('message', (channel: string, tags: tmi.ChatUserstate, message: string, self: boolean) => {
        if (self)
            return

        if (message == "jump"){
            getSocket().then((socket)=>{
                socket.emit("jump") // This calls jump in the Java code!
            })
        }

        if (message == "attack"){
            getSocket().then((socket)=>{
                socket.emit("attack") // This calls punch in the Java code!
            })
        }

        if (message == "defence"){
            getSocket().then((socket)=>{
                socket.emit("defence") // This calls guard in the Java code!
            })
        }

        if (message == "other"){
            getSocket().then((socket)=>{
                socket.emit("other") // This calls jump in the Java code!
            })
        }
    })
    
    */
}
