import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const connectionSchema = new mongoose.Schema({
    userID:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    connectionId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    status_accepted:{
        type: Boolean,
        default: null,
    }
})

const Connection = mongoose.model("Connection", connectionSchema);
export default Connection;