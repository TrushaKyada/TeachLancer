const router = require('express').Router();
const upload = require("../util/multer.photo");
const { verifyTeacher } = require("../middleware/teacher.middle")
const { verifyUser } = require("../middleware/user.middle")

const { 
    insertVideo,
    updateVideo,
    viewAllVideo,
    getVideoByUserId,
    getVideoByTeacherId,
    deleteVideo
} = require("../controller/video.controller");

router.post("/insert/:course_id", verifyTeacher, upload.array('video'), insertVideo);
router.put("/update/:id", verifyTeacher, upload.array('video'), updateVideo);
router.get("/view-all", viewAllVideo);
router.get("/get-by-user", verifyUser, getVideoByUserId)
router.get("/get-by-teacher", verifyTeacher, getVideoByTeacherId);
router.delete("/delete/:id", verifyTeacher, deleteVideo)

module.exports = router;