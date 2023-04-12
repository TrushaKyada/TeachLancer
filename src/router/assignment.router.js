const router = require('express').Router();
const upload = require("../util/multer.photo");
const { verifyTeacher } = require("../middleware/teacher.middle")
const { verifyUser } = require("../middleware/user.middle")

const { 
    insertAssignment,
    updateAssignment,
    viewAllAssignment,
    getAssignmentByUserId,
    getAssignmentByTeacherId,
    deleteAssignment
} = require("../controller/assignment.controller");

router.post("/insert/:course_id", verifyTeacher, upload.array('image'), insertAssignment);
router.put("/update/:id", verifyTeacher, upload.array('image'), updateAssignment);
router.get("/view-all", viewAllAssignment);
router.get("/get-by-user", verifyUser, getAssignmentByUserId)
router.get("/get-by-teacher", verifyTeacher, getAssignmentByTeacherId)
router.delete("/delete/:id", verifyTeacher, deleteAssignment)

module.exports = router;