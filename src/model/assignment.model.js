const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const assignmentSchema = new mongoose.Schema({
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
    image: {
        type: Array,
        required: true
    }
}, {
    timestamps: true
}, {
    collection: "assignment"
}
);

module.exports = mongoose.model("assignment", assignmentSchema);