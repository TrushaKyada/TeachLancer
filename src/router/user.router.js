const router = require('express').Router();
const upload = require("../util/multer.photo");
const { verifyUser } = require("../middleware/user.middle");
const { verifyAdmin } = require("../middleware/admin.middle")

const {
    userRegistration,
    userLogin,
    userProfile,
    userProfileUpdate,
    changePassword,
    addProfile,
    removeProfile,
    viewAllUser,
    deleteUser,
    viewUserById,
    userInfoForDashbord
} = require("../controller/user.controller");

router.post("/registration", upload.single("profile"), userRegistration);
router.post("/login", userLogin);
router.get("/view-profile", verifyUser, userProfile);
router.put("/update-profile", verifyUser, upload.single("profile"), userProfileUpdate);
router.put("/change-password", verifyUser, changePassword)
router.post("/add-profile", verifyUser, upload.single("profile"), addProfile);
router.put("/remove-profile", verifyUser, removeProfile);
router.get("/view-all", viewAllUser);
router.post("/delete/:id", verifyAdmin, deleteUser);
router.get("/view-by-id/:id", viewUserById);
router.get("/info-for-dashboard", verifyUser, userInfoForDashbord)

module.exports = router;