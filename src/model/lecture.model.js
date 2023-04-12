const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const lectureSchema =new mongoose.Schema({
    course_id: {
        type: ObjectId,
        ref: "courses"
    },
    course_name: {
        type: String,
        ref: "courses"
    },
    start_date: {
        type: String,   // january 10
        required: true
    },
    end_date: {
        type: String,  // march 30
        required: true
    },
    day: {
        type: Array,
        required: true
    },
    start_time: {
        type: String,  // 11:00Am
        required: true
    },
    end_time: {
        type: String,  // 03:00Pm
        required: true
    },
    timezone: {
        type: String,  // India Standard Time
        required: true
    },
    slot: {
        type: Number,  
    },
    code: {
        type: String,
        default: null
    }
},
{
    timestamps:true
},
{
    collection:"lecture",
});

module.exports = mongoose.model("lecture",lectureSchema);