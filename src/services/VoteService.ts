import Team from "./../enums/Team"
import Action from "./../enums/Action"
import { EventEmitter } from "events";
import {sendAction} from "./AttackService"
import {getTeam, hasTeam} from "./TeamService"
import Clock from "./../classes/Clock"
import Signal from "./../classes/Signal"

const VOTE_INTERVAL_SECONDS: number = 10
const VOTE_INTERVAL_MS: number = VOTE_INTERVAL_SECONDS * 1000;
const VOTES: Map<Team, Map<Action, number>> = new Map([
    [Team.P1, new Map()],
    [Team.P2, new Map()],
])
const VOTER_MAP: Map<string, boolean> = new Map()

export let votesEmitter = new EventEmitter()
export const TimeTick = new Signal() // number
export const VotingFinished = new Signal() // (Team, Action)

// Exposed Methods \\
export function castedVote(userid: string): boolean{
    return VOTER_MAP.has(userid)
}

export function castVote(userid: string, action: Action){
    if (castedVote(userid))
        return

    if (!hasTeam(userid))
        return

    const team: Team = getTeam(userid) as Team

    let teamActionsCount: Map<Action, number> = VOTES.get(team) as Map<Action, number>
    
    if (!teamActionsCount.has(action))
        return

    const currentCount: number = teamActionsCount.get(action) as number

    teamActionsCount.set(action, currentCount + 1)
    VOTER_MAP.set(userid, true)
    votesEmitter.emit("CastedVote", userid)
}

export function getActionVoteCount(team: Team, action: Action): number{
    if (!VOTES.has(team))
        return 0

    let teamVotes: Map<Action, number> = VOTES.get(team) as Map<Action, number>

    return teamVotes.get(action) || 0
}

//||||||||||||||||||\\

function getMajorityVote(team: Team): Action | null {
    let mostVotedAction: Action | null = null
    let mostVotes: number = 0

    if (!VOTES.has(team))
        return null

    let teamActionsCount: Map<Action, number> = VOTES.get(team) as Map<Action, number>

    teamActionsCount.forEach((value: number, key: Action) => {
        if (value > mostVotes){
            mostVotedAction = key
            mostVotes = value
        }
    })

    return mostVotedAction
}

function resetVotes(){
    Object.values(Action).forEach((action: Action)=>{
        for (const team of [Team.P1, Team.P2]) {
            VOTES.get(team)?.set(action, 0)
        }
    })

    VOTER_MAP.clear()
    votesEmitter.emit("VotesReset")
}

function votingFinished(){
    for (const team of [Team.P1, Team.P2]) {
        const action: Action | null = getMajorityVote(team)
        VotingFinished.Fire(team, action)

        if (!action)
            continue

        sendAction(team, action)
    }

    resetVotes()
}

export function init(){
    let clock = new Clock(VOTE_INTERVAL_SECONDS)
    clock.Tick.Connect((currentTime)=>{
        let currentTimeLeft: number = VOTE_INTERVAL_SECONDS - currentTime

        TimeTick.Fire(currentTimeLeft)
    })

    clock.Elapsed.Connect(votingFinished)
}