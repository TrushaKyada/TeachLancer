const router = require('express').Router();
const upload = require("../util/multer.photo");
const { verifyAdmin } = require("../middleware/admin.middle")

const { 
    addTeacherData,
    teacherLogin,
    updateTeacherData,
    getTeacherProfile,
    viewAllTeacherData,
    deleteTeacher
} = require("../controller/teacher.controller");

router.post("/insert", verifyAdmin, upload.single("profile"), addTeacherData);
router.post("/login", teacherLogin);
router.put("/update/:id", verifyAdmin, upload.single("profile"), updateTeacherData);
router.get("/view-profile/:id", verifyAdmin, getTeacherProfile);
router.get("/view-all", viewAllTeacherData);
router.post("/delete/:id", verifyAdmin, deleteTeacher)

module.exports = router;