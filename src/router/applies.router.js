const router = require('express').Router();
const { verifyUser } = require("../middleware/user.middle");
const { verifyCompany } = require("../middleware/company.middle")

const { 
    applyInternship,
    applyJob,
    getAppliesInternshipByUserToken,
    getAppliesJobsByUserToken,
    getAppliesInternshipByUserId,
    getAppliesJobsByUserId,
    listApplyInJob,
    listApplyInIntern,
    takeActionForJob,
    takeActionForIntern,
    updateAppliesStatus
} = require("../controller/applies.controller");

router.post("/apply-internship/:id", verifyUser, applyInternship);
router.post("/apply-job/:id", verifyUser, applyJob);
router.get("/get-internship", verifyUser, getAppliesInternshipByUserToken);
router.get("/get-job", verifyUser, getAppliesJobsByUserToken);
router.get("/get-internship/:id", getAppliesInternshipByUserId);
router.get("/get-job/:id", getAppliesJobsByUserId);
router.get("/list-apply-job/:jod_id", verifyCompany, listApplyInJob);
router.get("/list-apply-intern/:intern_id", verifyCompany, listApplyInIntern)
router.post("/take-action-job/:applied_id", verifyCompany, takeActionForJob)
router.post("/take-action-intern/:applied_id", verifyCompany, takeActionForIntern);
router.put("/update-status/:id", verifyCompany, updateAppliesStatus)

module.exports = router;