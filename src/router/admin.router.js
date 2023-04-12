const router = require('express').Router();
const upload = require("../util/multer.photo");
const { verifyAdmin } = require("../middleware/admin.middle")

const { 
    adminLogin,
    adminProfile,
    academyRegistration,
    academyProfileUpdate,
    changePassword,
    addProfile,
    removeProfile,
    howManyUser,
    howManyCompanies,
    howManyCourse,
    howManyUserApply
} = require("../controller/admin.controller");

router.post("/login", adminLogin);
router.get("/view-profile" , verifyAdmin , adminProfile);
router.post("/registration", upload.single("profile"),academyRegistration);
router.put("/update-profile", verifyAdmin, upload.single("profile"), academyProfileUpdate);
router.put("/change-password", verifyAdmin, changePassword);
router.post("/add-profile", verifyAdmin, upload.single("profile"), addProfile);
router.put("/remove-profile", verifyAdmin, removeProfile);
router.get("/count-user", verifyAdmin, howManyUser);
router.get("/count-company", verifyAdmin, howManyCompanies);
router.get("/count-courses", verifyAdmin, howManyCourse);
router.get("/user-apply-count", verifyAdmin, howManyUserApply)

module.exports = router;