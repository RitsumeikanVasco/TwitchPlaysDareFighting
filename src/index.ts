require("dotenv").config();

import express from 'express'
import Config from "./Config.json"
import API from "./API.json"
import {getToken} from "./functions/getToken"

interface TokenResponse {
    access_token: string;
    expires_in: number;
    token_type: 'bearer';
}

const app = express()

app.listen(Config.port, async () => {
    let token: TokenResponse = await getToken()

})