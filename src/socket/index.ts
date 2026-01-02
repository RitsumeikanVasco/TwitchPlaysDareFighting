import GameSocket from "./GameSocket"
import TwitchSocket from "./TwitchSocket"

export async function socketInit(){
    GameSocket()
    TwitchSocket()
}