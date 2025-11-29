
require("dotenv").config()
const request = require("request")


const getToken = (_url: any, callback: any) => {
    const options = {
        url: process.env.GET_TOKEN,
        json: true,
        body: {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'client_credentials'
        }
    }

    request.post(options, (err: any, res: any, body: any) => {
        if (err)
            return console.log(err);

        console.log(`Status: ${res.status}`)
        console.log(body)

        callback(res)
    })
}

getToken(process.env.GET_TOKEN, (res: any)=>{
    console.log(res)
})