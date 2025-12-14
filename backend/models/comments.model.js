import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const commentsSchema = new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    postId:{
        type: Schema.Types.ObjectId,
        ref: 'Post',
    },
    body:{
        type: String,
        required: true,
    }
});

const Comment = mongoose.model("Comment", commentsSchema);
export default Comment;