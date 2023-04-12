const router = require('express').Router();

const { 
    joinChatRoom,
    getChatByUserId,
    getChatByChatRoomId,
    remainingUser
} = require("../controller/chat.controller");

router.post("/join-chat-room", joinChatRoom);
router.get("/get-chat-by-user/:userId", getChatByUserId);
router.get("/get-chat/:chatRoomId", getChatByChatRoomId);
router.get("/remaining-user/:userId", remainingUser)

module.exports = router;