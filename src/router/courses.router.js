const router = require('express').Router();
const upload = require("../util/multer.photo");
const { verifyAdmin } = require("../middleware/admin.middle")

const { 
    addCourse,
    updateCourse,
    getCourseData,
    viewAllCourseData,
    getCourseDataByTerm,
    getCourseDataByTeacherCode,
    deleteCourse
} = require("../controller/courses.controller");

router.post("/insert", verifyAdmin, upload.single("id_proof"),addCourse);
router.put("/update/:id", verifyAdmin, upload.single("id_proof"), updateCourse)
router.get("/view-by-id/:id", getCourseData);
router.get("/view-all", viewAllCourseData);
router.post("/view-by-term", getCourseDataByTerm);
router.get("/view-by-code/:unique_code", getCourseDataByTeacherCode);
router.post("/delete/:id", verifyAdmin, deleteCourse)

module.exports = router;