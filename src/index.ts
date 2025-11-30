/*

To get the bot token just insert this into the browser and extract the access_token

https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000&scope=chat:read+chat:edit

*/

require("dotenv").config();

import express from 'express'
import Config from "./Config.json"

import {socketInit} from "./socket/index"
import {twitchInit} from "./twitch/index"

const app = express()

app.listen(Config.port, async () => {
    await socketInit()
    await twitchInit()
})