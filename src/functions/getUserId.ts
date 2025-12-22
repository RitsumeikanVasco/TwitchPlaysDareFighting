import axios from "axios";

export async function getUserId(username: string, accessToken: string, clientId: string) {
    const res = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
        headers: {
            "Client-Id": clientId,
            "Authorization": `Bearer ${accessToken}`
        }
    });
    return res.data.data[0].id; // numeric string
}