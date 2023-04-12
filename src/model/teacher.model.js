const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
require("dotenv").config()

const teacherSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,  // 6-digit
    },
    phone_code: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        default: "https://res.cloudinary.com/dxrwia7os/image/upload/v1673850833/lyiwo7vvuqo5hzrfshx4.png"
    },
    position: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    unique_code: {
        type: String,
        default: null
    },
    status: {
        type: Number,   // 1-active 2-inActive
        default: null
    },
    token: {
        type: String
    }
}, {
    timestamps: true
}, {
    collection: "teacher"
}
);

teacherSchema.methods.generateauthtoken = async function () {
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

module.exports = mongoose.model("teacher", teacherSchema);