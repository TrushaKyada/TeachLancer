const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const appliesSchema = new mongoose.Schema({
    types: {
        type: Number,   // 1-internship 2-job
    },
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
    company_name: {
        type: String,
        ref: "company"
    },
    company_city: {
        type: String,
        ref: "company"
    },
    username: {
        type: String,
        ref: "user"
    },
    user_email: {
        type: String,
        ref: "user"
    },
    position: {
        type: String,
        ref: "jobs"
    },
    status: {
        type: Number,  // 1-appied 2-action 3-hired 4-reject
        default: 1
    }
},
    {
        timestamps: true
    },
    {
        collection: "applies",
    });

module.exports = mongoose.model("applies", appliesSchema)