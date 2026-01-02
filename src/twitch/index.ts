import { initiateBot } from "../functions/initiateBot"
import * as SessionBot from "./SessionBot"
import * as TeamBot from "./teamBot"

export async function twitchInit(){
    await SessionBot.initSessionBot()
    // await TeamBot.startTeamBot()
}
