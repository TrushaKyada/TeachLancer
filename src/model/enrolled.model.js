const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const enrolledSchema = new mongoose.Schema({
    course_id: {
        type: ObjectId,
        required: true,
        ref: "courses"
    },
    user_id: {
        type: ObjectId,
        required: true,
        ref: "user"
    },
    course_title: {
        type: String,
        ref: "courses"
    },
    user_name: {
        type: String,
        ref: "user"
    },
    status: {
        type: Number,  // 1-active 2-inActive
        default: 1 
    },
    code: {
        type: String,
        default: null
    }
},
    {
        timestamps: true
    },
    {
        collection: "enrolled",
    });

module.exports = mongoose.model("enrolled", enrolledSchema)