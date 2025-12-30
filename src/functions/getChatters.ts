import axios from "axios";
import bot_keys from "./../../bot_keys.json"
import {getBotKeys, BotKeys} from "./../Database"
import { getUserIdFromUsername } from "./getUserIdFromUsername";

export async function getChatters() {
    let botKeys: BotKeys | null = await getBotKeys(bot_keys.twitchPlaysBot)

    if (!botKeys)
        return []

    let broadcasterId = await getUserIdFromUsername("prooheckcp", botKeys.access_token, botKeys.client_id)
    let botId = await getUserIdFromUsername(botKeys.username, botKeys.access_token, botKeys.client_id)

    let chatters: any[] = [];
    let cursor: string | undefined = undefined;

    do {
        const url = new URL("https://api.twitch.tv/helix/chat/chatters");
        url.searchParams.set("broadcaster_id", broadcasterId);
        url.searchParams.set("moderator_id", botId);
        if (cursor) url.searchParams.set("after", cursor);

        const res = await axios.get(url.toString(), {
            headers: {
                "Client-Id": botKeys.client_id,
                "Authorization": `Bearer ${botKeys.access_token}`
            }
        });

        chatters.push(...res.data.data);
        cursor = res.data.pagination?.cursor; // undefined if last page
    } while (cursor);

    return chatters;    
}