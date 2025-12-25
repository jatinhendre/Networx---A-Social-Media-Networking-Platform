import mongoose from "mongoose";
import { Schema } from "mongoose";
const testimonialSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    role:{
        type:String,
        required:true,
        default:'Other'
    },
    testimonial:{
        type:String,
        required:true
    }
})

const Testimonial = mongoose.model('Testimonial', testimonialSchema );
export default Testimonial
