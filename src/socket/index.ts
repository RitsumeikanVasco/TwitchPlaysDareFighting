import GameSocket from "./GameSocket"
import TwitchSocket from "./TwitchSocket"
import OBSSocket from "./OBSSocket"

export async function socketInit(){
    GameSocket()
    TwitchSocket()
    OBSSocket()
}