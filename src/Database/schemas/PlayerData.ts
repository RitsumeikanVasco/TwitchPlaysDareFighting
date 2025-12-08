import mongoose from 'mongoose';
const { Schema } = mongoose;

const PlayerData = new Schema({
    points: Number,
});

export default PlayerData