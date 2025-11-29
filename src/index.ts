require("dotenv").config();

import express from 'express'
import Config from "./Config.json"
import API from "./API.json"
import {getToken} from "./functions/getToken"

const app = express()

app.listen(Config.port, () => {
    let token = getToken()
    
    console.log(token)
})