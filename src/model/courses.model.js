const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const courseSchema = new mongoose.Schema({
    unique_code: {
        type: String,
        ref: "teacher"
    },
    teacher_name: {
        type: String,
        ref: "teacher"
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skill: {
        type: Array,    // 6 - skill fix
        required: true
    },
    term: {
        type: Number,    // 1-short term 2-long term
        required: true
    },
    criteria: [
        {
            qualification: {
                type: String, 
                required: true
            },
            id_proof: {
                type: String
            },
            age: {
                type: String, 
                required: true
            },
            communication: {
                type: String, 
                required: true
            },
            hardware: {
                type: String, 
                required: true
            }
        }
    ],
    fees: {
        type: Number,
        required: true
    },
    candidate: {
        type: Array,   // ex-webDeveloper, marketing manager
        required: true
    },
    status: {
        type: Number,  // 1-active 2-inactive
        default: 1
    }
},
    {
        timestamps: true
    },
    {
        collection: "courses",
    });

module.exports = mongoose.model("courses", courseSchema)