import axios from "axios";
import API from "./../API.json"

export async function refreshAccessToken() {
  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID!,
    client_secret: process.env.CLIENT_SECRET!,
    grant_type: "refresh_token",
    refresh_token: API.refresh
  });

  const res = await axios.post("https://id.twitch.tv/oauth2/token", params);
  
  // Twitch returns a new access_token AND a new refresh_token
  return res.data; // { access_token, refresh_token, expires_in, scope }
}
