require("dotenv").config();

import express from 'express'
import Config from "./Config.json"
import API from "./API.json"
import {getToken} from "./functions/getToken"



const app = express()

app.listen(Config.port, async () => {
    let token = await getToken()

    console.log("===GetTokenReturn===")
    console.log(token)
})