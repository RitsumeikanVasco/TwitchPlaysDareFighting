import mongoose from "mongoose"
import PlayerData from "./schemas/PlayerData"
import Config from "./../Config.json"

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB Server ✅");
})


export async function databaseInit(){
    console.log("Database Init")
    await mongoose.connect(`mongodb://127.0.0.1:${Config.database_port}`);
    console.log("Connected to MongoDB")

    const playerDataModel = mongoose.model("PlayerData", PlayerData)
    let poop = new playerDataModel()
    poop.save()
} 