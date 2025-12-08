import mongoose from "mongoose"
import PlayerData from "./schemas/PlayerData"
import Config from "./../Config.json"

mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to DB");
})

export async function databaseInit(){
    await mongoose.connect(`mongodb://127.0.0.1:${Config.database_port}`);

    const playerDataModel = mongoose.model("PlayerData", PlayerData)
    let poop = new playerDataModel()
    poop.save()
} 