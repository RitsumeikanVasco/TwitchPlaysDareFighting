import axios from "axios"
import API from "./../API.json"

export async function getToken (){
    try {
        // 2. axios.post takes two main arguments: The URL, and the Data (body)
        const response = await axios.post(API.oauth2, {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'client_credentials'
        });

        // 3. Success! The data is inside response.data
        console.log("Status:", response.status);
        console.log("Access Token:", response.data.access_token);
        
        return response.data;

    } catch (error: any) {
        console.error("Error fetching token:", error.response ? error.response.data : error.message);
    }
}