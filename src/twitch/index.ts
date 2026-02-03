import * as NotificationBot from "./NotificationBot"
import * as SessionBot from "./SessionBot"
import * as TeamBot from "./teamBot"
import * as AttackBot from "./AttackBot"

export async function twitchInit(){
    await SessionBot.initSessionBot()
    await NotificationBot.initNotificationBot()
    await TeamBot.initTeamBot()
    await AttackBot.initAttackBot()
}
