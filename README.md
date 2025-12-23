# TwitchPlaysDareFighting
Project for Advanced Topics in Computational Intelligence in Games


## Setup

1) Install Node.js dependencies

- Ensure Node.js >= 18
- Run: `npm install`

2) Install MongoDB Community Server

- macOS (Homebrew): `brew tap mongodb/brew && brew install mongodb-community@7.0`
- Windows: Download installer from https://www.mongodb.com/try/download/community and run setup
- Linux: Use distro packages per https://www.mongodb.com/docs/manual/administration/install-community/

3) Start MongoDB server

- macOS (brew): `brew services start mongodb-community@7.0`
- Generic: `mongod --dbpath <your_db_path>`
- Verify: `mongo --eval "db.runCommand({ ping: 1 })"` or `mongosh`

4) Get Twitch credentials

- Client ID & Secret: Create an app at https://dev.twitch.tv/console/apps (register, then copy Client ID; reveal Client Secret)
- Bot token: Use https://twitchapps.com/tmi/ or generate via OAuth with scope "chat:read chat:edit" for your bot account; set BOT_USERNAME to that account's username

5) Run tests

- `npm run test`
