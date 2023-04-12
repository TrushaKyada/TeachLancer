const router = require('express').Router();
const { verifyUser } = require("../middleware/user.middle")

const { 
    insertCarrerDetails,
    updateCarrerDetails,
    viewCareerDetails,
    viewCareerDetailsById,
    viewCareerDetailsByUserId
} = require("../controller/career.controller");

router.post("/insert-career", verifyUser, insertCarrerDetails);
router.put("/update-career", verifyUser, updateCarrerDetails);
router.get("/view", viewCareerDetails);
router.get("/view-by-id/:id", viewCareerDetailsById);
router.get("/view-by-user-id/:user_id", viewCareerDetailsByUserId)

module.exports = router;