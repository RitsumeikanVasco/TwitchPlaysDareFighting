import mongoose from 'mongoose';
const { Schema } = mongoose;

const PlayerData = new Schema({
    _id: { 
        type: String, 
        required: true 
    }, // Add this line
    points: {
        type: Number,
        required: true,
        default: 0
    },
});

export default PlayerData