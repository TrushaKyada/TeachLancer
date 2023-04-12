const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
require("dotenv").config()

const userSchema = new mongoose.Schema({
    profile: {
        type: String,
        default: "https://res.cloudinary.com/dxrwia7os/image/upload/v1673850833/lyiwo7vvuqo5hzrfshx4.png"
    },
    first_name: {
        type: String,
        default: null
    },
    last_name: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true
    },
    password: {
        
        type: String,  // 6-digit
        required: true
    },
    gender: {
        type: String,
        default: null
    },
    phone_code: {
        type: String,
        default: null
    },
    mobile: {
        type: String,
        required: true
    },
    whats_app: {
        type: Number,
        default: 0  // 0-isFalse 1-isTrue
    },
    city: {
        type: String,
        default: null
    },
    second_city: {
        type: String,
        default: null
    },
    mother_tongue: {
        type: String,
        default: null
    },
    language: {
        type: Number,  // 0-English 1-motherToungue
        default: 1
    },
    linkedin_profile: {
        type: String,
        default: null
    },
    about_yourself: {
        type: String,
        default: null
    },
    wallet:{
        type: String,  // float value
        default: 5000
    },
    token: {
        type: String,
        default: null
    }
}, {
    timestamps: true
}, {
    collection: "user"
}
);

userSchema.methods.generateauthtoken = async function () {
    try {
        const t = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY)
        this.tokens = t
        await this.save();
        return t;
    }
    catch (error) {
        console.log("error", error);
    }
}

module.exports = mongoose.model("user", userSchema);