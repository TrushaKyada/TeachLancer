const router = require('express').Router();
const { verifyCompany } = require("../middleware/company.middle")
const { verifyUser } = require("../middleware/user.middle");
const { verifyTeacher } = require("../middleware/teacher.middle")

const { 
    insertEnrolled,
    howManyEnrolled,
    getUserByCourse,
    updateStatus,
    courseWiseEnrolledUserList,
    lectureWiseUserList,
    courseWiseUserCount
} = require("../controller/enrolled.controller");

router.post("/insert", verifyUser,insertEnrolled);
router.get("/enrolled-count", howManyEnrolled);
router.get("/view-by-course/:course_id", getUserByCourse);
router.put("/update-status/:id", verifyCompany, updateStatus);
router.get("/user-list/:course_id", courseWiseEnrolledUserList);
router.get("/lecture-wise-user-list/:lecture_code", lectureWiseUserList);
router.get("/course-count/:course_id", verifyTeacher, courseWiseUserCount)

module.exports = router;
