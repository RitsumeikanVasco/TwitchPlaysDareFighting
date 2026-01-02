import {get, set, has, playersData} from "../Database/index"

export function getPoints(userid: string): number {
    if (!has(userid, "points"))
        return 0

    return get(userid, "points") as number
}

export function givePoints(userid: string, points: number){
    if (!has(userid, "points") || points == 0)
        return

    let currentPoints: number = getPoints(userid)
    set(userid, "points", currentPoints + points)
}

export function removePoints(userid: string, points: number){
    if (!has(userid, "points") || points == 0)
        return

    let currentPoints: number = getPoints(userid)
    let newPoints: number = Math.max(0, currentPoints - points)

    set(userid, "points", newPoints)
}

export function hasPoints(userid: string, points: number): boolean {
    let currentPoints: number = getPoints(userid)

    return currentPoints >= points
}

export function purchase(userid: string, points: number, callback: () => boolean){
    if (!hasPoints(userid, points))
        return

    if (callback())
        removePoints(userid, points)
}

export function init(){

}