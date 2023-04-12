const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const hiredSchema = new mongoose.Schema({
    user_id: {
        type: ObjectId,
        ref: "user"
    },
    company_id: {
        type: ObjectId,
        ref: "company"
    },
    work_id: {
        type: ObjectId,
        ref: "internship & jobs"
    },
    applies_id: {
        type: ObjectId,
        ref: "applies"
    },
    username: {
        type: String,
        ref: "user"
    },
    compnay_name: {
        type: String,
        ref: "company"
    },
    position: {
        type: String,
        ref: "jobs",
        default: null
    }
},
    {
        timestamps: true
    },
    {
        collection: "hired",
    });

module.exports = mongoose.model("hired", hiredSchema)