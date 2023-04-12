const router = require('express').Router();
const upload = require("../util/multer.photo");
const { verifyCompany } = require("../middleware/company.middle");
const { verifyAdmin } = require("../middleware/admin.middle")

const {
    companyRegistration,
    companyLogin,
    companyProfile,
    companyProfileUpdate,
    changePassword,
    addProfile,
    removeProfile,
    howManyUserApplyByCom,
    getAllAppliedUser,
    viewAllCompany,
    deleteCompnay,
    allCountForCompany
} = require("../controller/company.controller");

router.post("/registration", upload.single("image"), companyRegistration);
router.post("/login", companyLogin);
router.get("/view-profile", verifyCompany, companyProfile);
router.put("/update-profile", verifyCompany, upload.single("image"), companyProfileUpdate);
router.put("/change-password", verifyCompany, changePassword)
router.post("/add-image", verifyCompany, upload.single("image"), addProfile);
router.put("/remove-image", verifyCompany, removeProfile);
router.get("/apply-user-by-company", verifyCompany, howManyUserApplyByCom)
router.get("/apply-user-list", verifyCompany, getAllAppliedUser);
router.get("/view-all", verifyAdmin, viewAllCompany);
router.post("/delete/:id", verifyAdmin, deleteCompnay);
router.get("/count", verifyCompany, allCountForCompany)

module.exports = router;