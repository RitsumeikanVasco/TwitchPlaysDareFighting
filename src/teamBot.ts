// src/twitch/teamBot.ts
import tmi from "tmi.js";
import fs from "fs";
import path from "path";

type Team = "P1" | "P2";
type TeamMap = Record<string, Team>;

// チーム情報を保存する JSON ファイルの場所
// プロジェクト構成に合わせて好きに変えてOK
const TEAM_FILE_PATH = path.join(__dirname, "../../shared/team.json");

// メモリ上のユーザー -> チームマップ
const userTeam: TeamMap = {};
let joinCounter = 0;

/**
 * 起動時に team.json があれば読み込む
 */
function loadTeamsFromFile() {
  try {
    if (fs.existsSync(TEAM_FILE_PATH)) {
      const raw = fs.readFileSync(TEAM_FILE_PATH, "utf-8");
      const data = JSON.parse(raw) as TeamMap;
      Object.assign(userTeam, data);

      // joinCounter を現在人数に合わせておく（雑に人数で合わせる）
      const count = Object.keys(userTeam).length;
      joinCounter = count;
      console.log(`[teamBot] Loaded ${count} users from team.json`);
    } else {
      console.log("[teamBot] team.json not found, start with empty teams");
    }
  } catch (err) {
    console.error("[teamBot] Failed to load team.json:", err);
  }
}

/**
 * team.json に現在のチーム情報を保存
 */
function saveTeamsToFile() {
  try {
    const dir = path.dirname(TEAM_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      TEAM_FILE_PATH,
      JSON.stringify(userTeam, null, 2),
      "utf-8"
    );
    console.log("[teamBot] team.json updated");
  } catch (err) {
    console.error("[teamBot] Failed to save team.json:", err);
  }
}

/**
 * join コマンドを処理
 */
async function handleJoin(
  client: tmi.Client,
  channel: string,
  username: string
) {
  // すでにチームに入っている場合
  if (username in userTeam) {
    const team = userTeam[username];
    await client.say(channel, `@${username} You are already in team ${team}!`);
    return;
  }

  // 交互に P1 / P2 を割り当て
  const team: Team = joinCounter % 2 === 0 ? "P1" : "P2";
  joinCounter += 1;

  userTeam[username] = team;
  saveTeamsToFile();

  await client.say(channel, `@${username} You joined team ${team}! 🎮`);
}

/**
 * Twitch ボットを起動するメイン関数
 * サーバーのエントリポイントから呼び出す想定
 */
export function startTeamBot() {
  const username = process.env.TEAM_BOT_USERNAME;
  const password = process.env.TEAM_BOT_TOKEN;
  const channelName = process.env.TWITCH_CHANNEL_NAME;

  if (!username || !password || !channelName) {
    console.error(
      "[teamBot] Missing TWITCH_BOT_USERNAME / TWITCH_OAUTH_TOKEN / TWITCH_CHANNEL_NAME"
    );
    return;
  }

  loadTeamsFromFile();

  const client = new tmi.Client({
    options: { debug: true },
    identity: {
      username,
      password,
    },
    channels: [channelName],
  });

  client.connect().catch((err) => {
    console.error("[teamBot] Failed to connect to Twitch:", err);
  });

  client.on("message", async (channel, tags, message, self) => {
    // 自分のメッセージは無視
    if (self) return;

    const content = message.trim().toLowerCase();

    // Python版と同じく "join" でチーム分け
    if (content === "join") {
      const user = tags.username;
      if (!user) return;
      await handleJoin(client, channel, user);
      return;
    }

    // ここに他のチャットコマンドを増やしてもOK
  });

  client.on("connected", () => {
    console.log("[teamBot] Connected to Twitch chat");
  });

  client.on("disconnected", (reason) => {
    console.log("[teamBot] Disconnected from Twitch:", reason);
  });
}

/**
 * サーバー側からチーム情報を参照したい場合用の accessor
 */
export function getTeam(username: string): Team | undefined {
  return userTeam[username];
}

export function getAllTeams(): TeamMap {
  // 直接書き換えられないようにコピーを返す
  return { ...userTeam };
}
