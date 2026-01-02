/*

To get the bot token just insert this into the browser and extract the access_token

https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000&scope=chat:read+chat:edit

// Generate admin tokens
*/

require("dotenv").config();

import initializeModules from "./functions/initializeModules"
import Config from "./Config.json"
import path from 'path'

import {socketInit} from "./socket/index"
import {twitchInit} from "./twitch/index"
import {databaseInit} from "./Database/index"

import {sendAction} from "./services/AttackService"
import team from "./enums/Team"
import action from "./enums/Action"

async function initServer(){
    await databaseInit()
    await socketInit()
    await twitchInit()

    initializeModules(path.join(__dirname, "services"))
    /*
    setTimeout(()=>{
        sendAction(team.P1, action.STAND_FA)
        setTimeout(()=>{
            sendAction(team.P1, action.STAND_FA)
        }, 1000)
    }, 1000)    
    */
}


initServer()