const router = require('express').Router();
const upload = require("../util/multer.photo");

const { 
    createGroup,
    getGroupChatByGroupId,
    getGroupByUserId,
    getGroupById
} = require("../controller/group.controller");

router.post("/create/:teacherId", upload.single("group_img"), createGroup);
router.get("/view-chat/:group_id", getGroupChatByGroupId);
router.get("/view-group/:user_id", getGroupByUserId);
router.get("/group-list/:id", getGroupById)

module.exports = router;