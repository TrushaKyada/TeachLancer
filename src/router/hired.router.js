const router = require('express').Router();
const { verifyCompany } = require("../middleware/company.middle")

const { 
    hireUser,
    getHiredUserByCompnay
} = require("../controller/hired.controller");

router.post("/hire-user/:applies_id", verifyCompany, hireUser);
router.get("/view-by-company", verifyCompany, getHiredUserByCompnay)

module.exports = router;