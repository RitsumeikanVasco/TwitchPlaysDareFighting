import Team from "./../enums/Team"
import { EventEmitter } from "events";

const PLAYER_TEAMS: Map<string, Team> = new Map()

export let teamEmitter = new EventEmitter()

export function getTeam(userid: string): Team | null{
    return PLAYER_TEAMS.get(userid) || null
}

export function hasTeam(userid: string): boolean{
    return getTeam(userid) != null
}

export function getPlayersFromTeam(team: Team): string[]{
    let playerArray: string[] = []

    PLAYER_TEAMS.forEach((value: Team, userid: string)=>{
        if (team == value)
            playerArray.push(userid)
    })

    return playerArray
}

export function getTeamCount(team: Team): number{
    return getPlayersFromTeam(team).length
}

export function setTeam(userid: string, team: Team){
    if (getTeam(userid) == team)
        return

    PLAYER_TEAMS.set(userid, team)
    teamEmitter.emit("JoinedTeam", userid, team)
}

export function leaveTeam(userid: string){
    if (!hasTeam(userid))
        return

    PLAYER_TEAMS.delete(userid)
    teamEmitter.emit("LeftTeam", userid)
}