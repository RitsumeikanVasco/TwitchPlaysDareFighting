import { teamEmitter, setTeam, leaveTeam, hasTeam, getTeam } from "./../services/TeamService";
import Team from "./../enums/Team";
import { initiateBot } from "../functions/initiateBot";
import tmi from "tmi.js";
import bot_keys from "./../../bot_keys.json";
import Config from "./../Config.json";

export async function initTeamBot() {
    const twitchClient: tmi.Client | null = await initiateBot(
        bot_keys.twitchPlaysBot,
        Config.target_channel
    );

    if (!twitchClient) return;

    twitchClient.on("message", (_channel, tags, message, self) => {
        if (self) return;
        if (!tags["user-id"]) return;

        const userId = tags["user-id"];
        const username = tags["display-name"] ?? "User";
        const msg = message.trim().toLowerCase();

        switch (msg) {
            case "!team1":
            case "!p1":
                setTeam(userId, Team.P1);
                break;

            case "!team2":
            case "!p2":
                setTeam(userId, Team.P2);
                break;

            case "!leave":
                if (!hasTeam(userId)) {
                    twitchClient.say(
                        Config.target_channel,
                        `@${username} you are not on a team`
                    );
                    return;
                }

                leaveTeam(userId);
                twitchClient.say(
                    Config.target_channel,
                    `@${username} left their team`
                );
                break;
        }
    });
}