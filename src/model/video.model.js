const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const videoSchema = new mongoose.Schema({
    course_id: {
        type: ObjectId,
        required: true,
        ref: "courses"
    },
    teacher_id: {
        type: ObjectId,
        required: true,
        ref: "teacher"
    },
    video: {
        type: Array,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    }
}, {
    timestamps: true
}, {
    collection: "video"
}
);

module.exports = mongoose.model("video", videoSchema);