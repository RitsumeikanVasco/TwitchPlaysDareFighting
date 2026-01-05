import { initiateBot } from "../functions/initiateBot"
import {initNotificationBot} from "./NotificationBot"
import * as SessionBot from "./SessionBot"
import * as TeamBot from "./teamBot"

export async function twitchInit(){
    await SessionBot.initSessionBot()
    await initNotificationBot()
    // await TeamBot.startTeamBot()
}
