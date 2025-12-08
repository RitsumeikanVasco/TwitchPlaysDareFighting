import axios from "axios"
import API from "./../API.json"

export async function getToken (){
    try {
        const response = await axios.post(API.oauth2, {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            //grant_type: 'authorization_code',
            grant_type: 'client_credentials'
            //redirect_uri: process.env.REDIRECT_URI
            //redirect_uri: API["redirect-uri"]
        });

        return response.data;
    } catch (error: any) {
        console.error("Error fetching token:", error.response ? error.response.data : error.message);
    }
}