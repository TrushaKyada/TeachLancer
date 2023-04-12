const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const careerSchema = new mongoose.Schema({
    user_id: {
        type: ObjectId,
        ref: "user"
    },
    company_name: {
        type: String,
        default: null
    },
    company_bio: {
        type: String,
        default: null
    },
    com_start_date: {
        type: String,    // dd-mm-yy
        default: null
    },
    com_end_date: {
        type: String,    // dd-mm-yy
        default: null
    },
    position: {
        type: String,
        default: null
    },
    your_role: {
        type: Number,
        default: null
    },
    project_name: {
        type: String,
        default: null
    },
    project_description: {
        type: String,
        default: null
    },
    pro_start_date: {
        type: String,     // dd-mm-yy
        default: null
    },
    pro_end_date: {
        type: String,     // dd-mm-yy
        default: null
    },
    member: {
        type: Number,
        default: null
    }
},
    {
        timestamps: true
    },
    {
        collection: "career",
    });

module.exports = mongoose.model("career", careerSchema)