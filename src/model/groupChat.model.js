const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const groupChatSchema = mongoose.Schema({
    groupId: {
        type: objectId,
        required: true,
        ref: 'group'
    },
    groupName: {
        type: String,
        required: true
    },
    chat: [
        {
            sender:{
                type : objectId
            },
            senderName: {
                type: String
            },
            senderImg: {
                type: String
            },
            message: {
                type: String
            }
        }
    ]
}, {
    timestamps: true
}, {
    collection: 'groupChat'
});

module.exports = mongoose.model('groupChat', groupChatSchema);