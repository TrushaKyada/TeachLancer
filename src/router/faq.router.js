const router = require('express').Router();
const { verifyAdmin } = require("../middleware/admin.middle")

const { 
    insertFAQ,
    updateFAQ,
    viewAllFAQ,
    getOneFAQ,
    deleteFAQ
} = require("../controller/faq.controller");

router.post("/insert", verifyAdmin, insertFAQ);
router.put("/update/:id", verifyAdmin, updateFAQ);
router.get("/view", viewAllFAQ);
router.get("/view-by-id/:id", getOneFAQ);
router.delete("/delete/:id", verifyAdmin, deleteFAQ)

module.exports = router;