const router = require('express').Router();
const upload = require("../util/multer.photo");
const { verifyUser } = require("../middleware/user.middle")

const { 
    forgetPassword,
    resetPassword
} = require("../controller/common.controller");

router.post("/forget-password", forgetPassword);
router.put("/reset-password/:token/:role", resetPassword)

module.exports = router;