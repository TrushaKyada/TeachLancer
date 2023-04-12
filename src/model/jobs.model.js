const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const jobsSchema =new mongoose.Schema({
    company_id: {
        type: ObjectId,
        ref: "company"
    },
    company_name: {
        type: String,
        ref: "company"
    },
    type: {
        type: Number,  // 1-inOffice 2-Remote
        required: true
    },
    position: {
        type: String,   // like - web developer
        required: true
    },
    vacancy: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    technology: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        default: null
    },
    address: {
        type: String,  // city, state, country
        default: null
    },
    active: {
        type: Number,   // 0-notActive 1-active
        default: 1
    }
},
{
    timestamps:true
},
{
    collection:"jobs",
});

module.exports = mongoose.model("jobs",jobsSchema);