const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
require("dotenv").config()

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,   // 6-digit
        required: true,
    },
    token: {
        type: String
    }
}, {
    timestamps: true
}, {
    collection: "admin"
}
);

adminSchema.methods.generateauthtoken = async function () {
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

module.exports = mongoose.model("admin", adminSchema);