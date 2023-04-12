const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const chatSchema = mongoose.Schema({
    chatRoomId: {
        type: objectId,
        required: true,
        ref: 'chatRoom'
    },
    chat: [
        {
            sender:{
                type : objectId
            },
            receiver: {
                type: objectId
            },
            message: {
                type: String
            },
            read: {
                type: Number,
                default: 0  // 0-unRead 1-read
            }
        }
    ]
}, {
    timestamps: true
}, {
    collection: 'chat'
});

module.exports = mongoose.model('chat', chatSchema)