import { initiateBot } from "../functions/initiateBot"
import * as NotificationBot from "./NotificationBot"
import * as SessionBot from "./SessionBot"
import * as TeamBot from "./teamBot"

export async function twitchInit(){
    await SessionBot.initSessionBot()
    await NotificationBot.initNotificationBot()
    await TeamBot.initTeamBot()
}
