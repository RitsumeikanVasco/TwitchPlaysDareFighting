import axios from "axios";

export async function getUsernameFromId(userId: string, accessToken: string, clientId: string) {
    try {
        const res = await axios.get(`https://api.twitch.tv/helix/users?id=${userId}`, {
            headers: {
                "Client-Id": clientId,
                "Authorization": `Bearer ${accessToken}`
            }
        });

        // Twitch returns an array; if the ID is valid, it's the first element
        if (res.data.data.length > 0) {
            return res.data.data[0].login; // This is the "username" (e.g., 'johndoe')
        }
        
        return null;
    } catch (error) {
        console.error("Error fetching username:", error);
        return null;
    }
}