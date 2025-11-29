/*

To get the bot token just insert this into the browser and extract the access_token

https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000&scope=chat:read+chat:edit

*/

require("dotenv").config();

import express from 'express'
import Config from "./Config.json"
import API from "./API.json"
import {getToken} from "./functions/getToken"
import tmi from "tmi.js"

// Types
import type { TokenResponse } from './ChatTypes.js';

const app = express()

app.listen(Config.port, async () => {
    let token: TokenResponse = await getToken()
    let accessToken: string = token.access_token
    let channelToListenUsername: string = process.env.CHANNEL_NAME as string

    const client = new tmi.Client({
	    channels: [ channelToListenUsername ],
        identity: {
            username: process.env.BOT_USERNAME,
            password: process.env.BOT_TOKEN
        },        
    })

    client.connect()

    client.on('message', (channel: string, tags: tmi.ChatUserstate, message: string, self: boolean) => {
        //client.say(channel, `@${tags.username}, heya!`);
    })
})