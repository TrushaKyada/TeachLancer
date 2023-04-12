const router = require('express').Router();
const { verifyAdmin } = require("../middleware/admin.middle")

const { 
    insertLecture,
    updateLecture,
    viewAllLecture,
    viewPartTimeLecture,
    viewFullTimeLecture,
    updateSlot,
    viewLectureById,
    viewLectureByCourseId,
    deleteLecture
} = require("../controller/lecture.controller");

router.post("/insert", insertLecture);
router.put("/update/:id", updateLecture);
router.get("/view-all", viewAllLecture);
router.get("/view-part-time-lecture/:course_id", viewPartTimeLecture);
router.get("/view-full-time-lecture/:course_id", viewFullTimeLecture);
router.put("/update-slot/:id", updateSlot);
router.get("/view-by-id/:id", viewLectureById);
router.get("/view-by-course-id/:course_id", viewLectureByCourseId);
router.post("/delete/:id", verifyAdmin, deleteLecture);

module.exports = router;