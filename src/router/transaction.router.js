const router = require('express').Router();
const { verifyAdmin } = require("../middleware/admin.middle");
const { verifyUser } = require("../middleware/user.middle");
const { verifyTeacher } = require("../middleware/teacher.middle");

const { 
    createCharge,
    paySalary,
    payFees,
    viewAllTransaction,
    viewTransactionByUserId,
    viewTransactionByTeacherId,
    viewTransactionByType
} = require("../controller/transaction.controller");

router.post("/pay/:user_id/:course_id", createCharge);
router.post("/pay-salary/:teacher_id", paySalary);
router.post("/pay-fees/:user_id/:course_id", payFees);
router.get("/view-all", verifyAdmin, viewAllTransaction)
router.get("/view-by-user", verifyUser, viewTransactionByUserId);
router.get("/view-by-teacher", verifyTeacher, viewTransactionByTeacherId);
router.get("/view-by-type/:type", verifyAdmin, viewTransactionByType)

module.exports = router;