import { getToken } from "./../functions/getToken"
import tmi from "tmi.js"
import { getSocket } from "./../socket/index"

// Types
import type { TokenResponse } from "./../ChatTypes.js"

export async function twitchInit() {
    const channelToListenUsername: string = process.env.CHANNEL_NAME as string
    const token: TokenResponse = await getToken()
    const accessToken: string = token.access_token

    const twitchClient = new tmi.Client({
        channels: [channelToListenUsername],
        identity: {
            username: process.env.BOT_USERNAME,
            password: process.env.BOT_TOKEN,
        },
    })

    // ==== 投票カウント用 =========================================
    const votes: Record<string, number> = {
        attack: 0,
        defense: 0,
        escape: 0,
        other: 0,
    }

    const VOTE_WINDOW_MS = 1000 // 1秒ごとに多数決

    // 一定間隔で投票を集計して Java 側に送る
    setInterval(async () => {
        const modes = ["attack", "defense", "escape", "other"] as const
        let winner = modes[0]

        // いちばん票が多いモードを選ぶ
        for (const m of modes) {
            if (votes[m] > votes[winner]) {
                winner = m
            }
        }

        // どれかに1票以上入っている場合だけ送信
        if (votes[winner] > 0) {
            const socket = await getSocket()
            // ★ Java 側で "set_mode" イベントを受け取る
            socket.emit("set_mode", winner)
            console.log("[Twitch] send mode:", winner)
        }

        // 次のウィンドウのためにリセット
        modes.forEach((m) => (votes[m] = 0))
    }, VOTE_WINDOW_MS)

    // ==== Twitch チャットからのコメント受信 ======================

    twitchClient.on(
        "message",
        (channel: string, tags: tmi.ChatUserstate, message: string, self: boolean) => {
            if (self) return

            const msg = message.trim().toLowerCase()

            // 好きなコマンドに合わせて調整してOK
            if (msg === "attack" || msg === "a") {
                votes.attack++
            } else if (msg === "defense" || msg === "defence" || msg === "d") {
                votes.defense++
            } else if (msg === "escape" || msg === "j" || msg === "jump") {
                votes.escape++
            } else if (msg === "other") {
                votes.other++
            }

            // もし「cri で必殺技」とかも入れたければここで別の emit を出せる
            // if (msg === "cri") { ... }
        }
    )

    twitchClient.connect()
}
