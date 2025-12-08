import mongoose from "mongoose"
import PlayerData from "./schemas/PlayerData"
import Config from "./../Config.json"

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB Server ✅");
})

let playerDataModel;

export async function databaseInit(){
    console.log("Database Init")
    await mongoose.connect(`mongodb://127.0.0.1:${Config.database_port}/${Config.database_name}`);
    console.log("Connected to MongoDB")

    playerDataModel = mongoose.model("PlayerData", PlayerData)
} 