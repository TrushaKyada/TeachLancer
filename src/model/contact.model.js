const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    message : {
        type: String,
        required: true
    }
}, {
    timestamps: true
}, {
    collection: "contact"
}
);

module.exports = mongoose.model("contact", contactSchema);