import axios from "axios";
import API from "./../API.json"
import bot_keys from "./../bot_keys.json"
import {getBotKeys, BotKeys} from "./initiateBot"
import { getUserId } from "./getUserId";

export async function getChatters() {
    let botKeys: BotKeys | null = await getBotKeys(bot_keys.twitchPlaysBot.key)

    let broadcasterId = await getUserId("prooheckcp", bot_keys.twitchPlaysBot.access_token)
    let botId = await getUserId(bot_keys.twitchPlaysBot.username, bot_keys.twitchPlaysBot.access_token)

    let chatters: any[] = [];
    let cursor: string | undefined = undefined;

    do {
        const url = new URL("https://api.twitch.tv/helix/chat/chatters");
        url.searchParams.set("broadcaster_id", broadcasterId);
        url.searchParams.set("moderator_id", botId);
        if (cursor) url.searchParams.set("after", cursor);

        const res = await axios.get(url.toString(), {
            headers: {
                "Client-Id": botKeys?.client_id,
                "Authorization": `Bearer ${botKeys?.access_token}`
            }
        });

        chatters.push(...res.data.data);
        cursor = res.data.pagination?.cursor; // undefined if last page
    } while (cursor);

    return chatters;
}