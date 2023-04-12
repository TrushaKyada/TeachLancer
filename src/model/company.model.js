const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
require("dotenv").config()

const companySchema = new mongoose.Schema({
    name: {
        type: String,   // company name
        required: true
    },
    image: {
        type: String,
        default: "https://res.cloudinary.com/dxrwia7os/image/upload/v1673850833/lyiwo7vvuqo5hzrfshx4.png"
    },
    type: {
        type: String,   // company type
        required: true
    },
    industry_type: {
        type: String,   // company's industry
        required: true
    },
    no_of_emp: {
        type: Number,
        required: true
    },
    your_name: {
        type: String,
        required: true
    },
    your_role: {
        type: String,   // registration karva wala no
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    whats_app: {
        type: Number,   // 0-isFalse 1-isTrue
        default: 0
    },
    password: {
        type: String,   // 6 digit
        required: true,
    },
    wallet:{
        type: String,  // float value
        default: 5000
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    token: {
        type: String
    }
}, {
    timestamps: true
}, {
    collection: "company"
}
);

companySchema.methods.generateauthtoken = async function () {
    try {
        const t = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY)
        this.tokens = t
        await this.save();
        return t;
    }
    catch (err) {
        console.log("err", err);
    }
}

module.exports = mongoose.model("company", companySchema);