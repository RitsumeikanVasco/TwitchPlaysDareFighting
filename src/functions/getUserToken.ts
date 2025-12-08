import axios from "axios";

export async function getUserToken() {
    const params = new URLSearchParams({
        client_id: process.env.CLIENT_ID!,
        client_secret: process.env.CLIENT_SECRET!,
        code: process.env.CODE!,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:3000" // same redirect URI you used
    });

    const response = await axios.post("https://id.twitch.tv/oauth2/token", params);

    return response.data;
}
