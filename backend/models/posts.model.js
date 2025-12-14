import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const postSchema = new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    updatedAt:{
        type: Date,
        default: Date.now,
    },
    body:{
        type: String,
        required: true,
    },
    likes:{
        type: Number,
        default: 0,
    },
    media:{
        type: String,   
        default:''
    },
    filetype:{
        type: String,   
        default:''
    },
    active:{
        type: Boolean,
        default: true,
    }
})

const Post = mongoose.model("Post", postSchema);
export default Post;