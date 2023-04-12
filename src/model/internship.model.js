const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const internshipSchema =new mongoose.Schema({
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
    time: {
        type: Number,  // 1-parttime 2-fulltime
        required: true
    },
    address: {
        type: String,  // city, state, country
        default: null
    },
    vacancy: {
        type: Number,
        required: true
    },
    start_date: {
        type: Date,  // date (DD/MM/YYYY)
        required: true
    },
    duration: {
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
    stipend: {   
        type: String,   // fixed, negotiable, performanceBased, unpaid
        required: true
    },
    stipend_salary: {
        type: Number,  // float value store karvani
        default: null
    },
    perks: {
        type: Array,
        required: true
    },
    skills: {
        type: Array,
        required: true
    },
    active: {
        type: Number,  // 1-active 2-inActive
        default: 1
    }
},
{
    timestamps:true
},
{
    collection:"internship",
});

module.exports = mongoose.model("internship",internshipSchema);