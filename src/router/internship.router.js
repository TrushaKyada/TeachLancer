const router = require('express').Router();
const { verifyCompany } = require("../middleware/company.middle");
const { verifyAdmin } = require("../middleware/admin.middle")

const { 
    postInternship,
    updateInternship,
    allInternshipList,
    viewInternshipDetails,
    getInternshipByLocation,
    getInternshipByTechnology,
    getInternshipByCompany,
    listInternshipByCompany,
    deleteInternship
} = require("../controller/internship.controller");

router.post("/post", verifyCompany, postInternship);
router.put("/update/:id", verifyCompany, updateInternship);
router.get("/list", allInternshipList);
router.get("/view-by-id/:id", viewInternshipDetails);
router.post("/view-by-location", getInternshipByLocation);
router.post("/view-by-technology", getInternshipByTechnology);
router.get("/view-by-company", verifyCompany,getInternshipByCompany);
router.get("/list-intern-by-company/:company_id", verifyAdmin, listInternshipByCompany);
router.delete("/delete/:id", verifyCompany, deleteInternship)

module.exports = router;