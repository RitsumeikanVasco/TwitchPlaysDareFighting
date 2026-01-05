import { initiateBot } from "../functions/initiateBot"
import tmi from "tmi.js"
import bot_keys from "./../../bot_keys.json"
import Config from "./../Config.json"
import Team from "./../enums/Team"
import Action from "./../enums/Action"
import {getUsernameFromUserId} from "./../twitch/SessionBot"
//Services
import {VotingFinished, getActionVoteCount} from "./../services/VoteService"
import {teamEmitter} from "./../services/TeamService"
import {shopEmitter} from "./../services/ShopService"
import {roundEmitter} from "./../services/RoundService"

function getTeamHeader(team: Team): string {
    let teamNumber: number = 1

    if (team == Team.P1)
        teamNumber = 1
    else
        teamNumber = 2
    
    return `[Team ${teamNumber}]`
}

export async function initNotificationBot(){
    const twitchClient: tmi.Client | null = await initiateBot(bot_keys.twitchPlaysBot, Config.target_channel)

    if (!twitchClient)
        return

    VotingFinished.Connect((team: Team, action: Action | null)=>{
        if (action)
            twitchClient.say(Config.target_channel, `${getTeamHeader(team)} Chose <${action}> with ${getActionVoteCount(team, action)} votes!`)
        else
            twitchClient.say(Config.target_channel, `${getTeamHeader(team)} didn't vote!`)
    })

    teamEmitter.on("JoinedTeam", (userid: string, team: Team)=>{
        const username: string | null = getUsernameFromUserId(userid)
        
        if(!username)
            return

        twitchClient.say(Config.target_channel, `${getTeamHeader(team)} @${username} joined!`)
    })

    shopEmitter.on("purchasedItem", (userid: string, itemId: string)=>{
        const username: string | null = getUsernameFromUserId(userid)
        
        if(!username)
            return

        twitchClient.say(Config.target_channel, `@${username} purchased ${itemId}!`)
    })

    roundEmitter.on("RoundFinished", (team: Team, round: number)=>{
        twitchClient.say(Config.target_channel, `${getTeamHeader(team)} won round ${round}!`)
    })
}