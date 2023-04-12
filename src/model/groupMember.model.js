const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const groupMemberSchema = mongoose.Schema({
    groupId: {
        type: objectId,
        required: true,
        ref: 'group'
    },
    users: [
        {
            user_id:{
                type : objectId
            },
            user_name: {
                type: String
            },
            user_img: {
                type: String
            },
            user_type: {
                type: Number  // 1-admin 2-normal
            }
        }
    ]
}, {
    timestamps: true
}, {
    collection: 'groupMember'
});

module.exports = mongoose.model('groupMember', groupMemberSchema);