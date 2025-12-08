import mongoose from 'mongoose';
const { Schema } = mongoose;

const PlayerData = new Schema({
    points: {
        type: Number,
        required: true,
        default: 0
    },
});

export default PlayerData