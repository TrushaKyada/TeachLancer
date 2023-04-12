const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const chatRoomSchema = mongoose.Schema({
    user1: {
        type: objectId,
        required: true
    },
    user2: {
        type: objectId,
        required: true
    }
}, {
    timestamps: true
}, {
    collection: 'chatRoom'
});

module.exports = mongoose.model('chatRoom', chatRoomSchema)