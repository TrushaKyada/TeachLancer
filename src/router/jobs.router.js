const router = require('express').Router();
const { verifyCompany } = require("../middleware/company.middle");
const { verifyAdmin } = require("../middleware/admin.middle")

const { 
    postJob,
    updateJobDetails,
    allJobList,
    viewJobDetails,
    getJobByLocation,
    getJobByTechnology,
    getJobByPosition,
    getJobByCompany,
    listJobByCompany,
    deleteJob
} = require("../controller/jods.controller");

router.post("/post", verifyCompany, postJob);
router.put("/update/:id", verifyCompany, updateJobDetails);
router.get("/list", allJobList);
router.get("/view-by-id/:id", viewJobDetails);
router.post("/view-by-location", getJobByLocation);
router.post("/view-by-technology", getJobByTechnology);
router.post("/view-by-position", getJobByPosition);
router.get("/view-by-company", verifyCompany, getJobByCompany);
router.get("/list-job-by-company/:company_id", verifyAdmin, listJobByCompany);
router.delete("/delete/:id", verifyCompany, deleteJob)

module.exports = router;