import {classifyChat} from "./../functions/classifyChat"
import ChatClass from "./../enums/ChatClass"
import { initiateBot } from "../functions/initiateBot";
import tmi from "tmi.js";
import bot_keys from "./../../bot_keys.json";
import Config from "./../Config.json";
import {castVote} from "./../services/VoteService"
import Action from "./../enums/Action"

const MOVES = new Map([
    [ChatClass.Punch, Action.STAND_FA],
    [ChatClass.Crouch, Action.CROUCH],
    [ChatClass.WalkForward, Action.FORWARD_WALK],
    [ChatClass.StepBack, Action.BACK_STEP],
    [ChatClass.Guard, Action.STAND_GUARD],
    [ChatClass.PunchUp, Action.STAND_F_D_DFA],
])

export async function initAttackBot() {
    const twitchClient: tmi.Client | null = await initiateBot(
        bot_keys.twitchPlaysBot,
        Config.target_channel
    );

    if (!twitchClient) return;
        twitchClient.on("message", (_channel, tags, message, self) => {
            if (self) 
                return
            
            if (message.startsWith("!"))
                return

            let chatClass: ChatClass = classifyChat(message)

            if (chatClass == ChatClass.other || !MOVES.has(chatClass))
                return

            const targetAction: Action = MOVES.get(chatClass) as Action
            const userid: string | undefined = tags["user-id"]

            if (!userid)
                return

            castVote(userid, targetAction)
        })
}