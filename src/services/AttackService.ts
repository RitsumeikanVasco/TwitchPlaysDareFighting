import Team from "./../enums/Team"
import Action from "../enums/Action"
import {getSocket} from "../socket/index"

export function sendAction(team: Team, action: Action){
    getSocket().then((socket)=>{
        socket.emit(team, action)
    })
}

export function stopAction(team: Team, action: Action){
    getSocket().then((socket)=>{
        socket.emit(team, action)
    })
}

export function stopAllActions(team: Team){
    getSocket().then((socket)=>{
        socket.emit(team)
    })
}