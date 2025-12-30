import {playersData, databaseEmitter, get, set} from "../Database/index"
import mongoose, { mongo } from "mongoose"
import { EventEmitter } from "events";

function getPlayerData(userid: string){
    return playersData.get(userid)
}

export function givePoints(userid: string, points: number){
    if (!playersData.has(userid))
        return

    playersData.get(userid)
}

export function getPoints(userid: string): number {

}

export function hasPoints(userid: string, points: number): boolean {

}

export function purchase(userid: string, points: number, callback: () => boolean){

}

export function init(){

}