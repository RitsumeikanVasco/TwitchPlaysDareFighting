import axios from "axios";

export async function getUserId(username: string, accessToken: string) {
    const res = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
        headers: {
            "Client-Id": process.env.CLIENT_ID!,
            "Authorization": `Bearer ${accessToken}`
        }
    });
    return res.data.data[0].id; // numeric string
}