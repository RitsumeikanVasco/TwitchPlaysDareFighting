import Team from "./../enums/Team"
import Action from "../enums/Action"
import {getSocket} from "../socket/index"

export function sendAction(team: Team, action: Action){
    getSocket().then((socket)=>{
        socket.emit("action", team, action)
    })
}

export function sendOneTimeAction(team: Team, action: Action){
    getSocket().then((socket) =>{
        socket.emit("oneaction", team, action)
    })
}

export function stopAction(team: Team, action: Action){
    getSocket().then((socket)=>{
        socket.emit("stopAction", team, action)
    })
}

export function stopAllActions(team: Team){
    getSocket().then((socket)=>{
        socket.emit("stopAllActions", team)
    })
}