import axios from "axios";

export interface RefreshResponseData {
    access_token: string;
    refresh_token: string;
}

export async function refreshAccessToken(
  clientId: string, 
  clientSecret: string, 
  refreshToken: string
) {
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken
  });

  const res = await axios.post("https://id.twitch.tv/oauth2/token", params);
  
  // Twitch returns a new access_token AND a new refresh_token
  return res.data; // { access_token, refresh_token, expires_in, scope }
}
