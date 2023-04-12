const Company = require("../model/company.model");
const Applies = require("../model/applies.model");
const Jobs = require("../model/jobs.model");
const Internship = require("../model/internship.model");
const Hired = require("../model/hired.model")
const bcrypt = require("bcrypt");
const cloudinary = require("../util/cloudinary.util");
const status = require('http-status');
const nodemailer = require("nodemailer");
const { sendEmail } = require("../helper/mail.services");


/* ----- Company Registration ----- */
exports.companyRegistration = async (req, res) => {
    try {

        const data = await Company.findOne({ email: req.body.email });
        let password = req.body.password;
        let confPassword = req.body.confirmPassword;

        if (data) {

            res.status(status.OK).json(
                {
                    message: "EMAIL ALREADY REGISTRATION !",
                    status: false,
                    code: 409
                }
            )

        }
        else {

            if (password == confPassword) {

                if (password.length >= 6) {

                    if (req.file == undefined) {

                        const companyDetails = new Company({
                            name: req.body.name,
                            type: req.body.type,
                            industry_type: req.body.industry_type,
                            no_of_emp: req.body.no_of_emp,
                            your_name: req.body.your_name,
                            your_role: req.body.your_role,
                            email: req.body.email,
                            mobile: req.body.mobile,
                            whats_app: req.body.whats_app,
                            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
                            wallet: req.body.wallet,
                            city: req.body.city,
                            state: req.body.state,
                            country: req.body.country
                        })
                        const saveData = await companyDetails.save()

                        // mail content
                        let subject = "Company Registeration Verify";
                        let content = { "userName": saveData.your_name, "email": saveData.email };
                        let filePath = '/home/kurm/web Design/All Work/node js/teachLancer/views/registerMail.ejs'

                        await sendEmail(saveData.email, subject, content, filePath)

                        res.status(status.CREATED).json(
                            {
                                message: "COMPANY REGISTRATION SUCCESSFULLY !",
                                status: true,
                                code: 201,
                                data: saveData
                            }
                        )

                    } else {

                        const cloudnaryImageUpload = async file => {
                            return new Promise(reslove => {
                                cloudinary.uploader.upload(file, (err, res) => {

                                    if (err) return err
                                    reslove({
                                        res: res.secure_url
                                    })
                                })
                            })
                        }

                        const file = req.file;

                        const { path } = file

                        const newPath = await cloudnaryImageUpload(path)

                        const companyDetails = new Company({
                            name: req.body.name,
                            image: newPath.res,
                            type: req.body.type,
                            industry_type: req.body.industry_type,
                            no_of_emp: req.body.no_of_emp,
                            your_name: req.body.your_name,
                            your_role: req.body.your_role,
                            email: req.body.email,
                            mobile: req.body.mobile,
                            whats_app: req.body.whats_app,
                            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
                            wallet: req.body.wallet,
                            city: req.body.city,
                            state: req.body.state,
                            country: req.body.country
                        })
                        const saveData = await companyDetails.save()

                        // mail content
                        let subject = "Company Registeration Verify";
                        let content = { "userName": saveData.your_name, "email": saveData.email };
                        let filePath = '/home/kurm/web Design/All Work/node js/teachLancer/views/registerMail.ejs'

                        await sendEmail(saveData.email, subject, content, filePath)

                        res.status(status.CREATED).json(
                            {
                                message: "COMPANY REGISTRATION SUCCESSFULLY !",
                                status: true,
                                code: 201,
                                data: saveData
                            }
                        )

                    }

                } else {

                    res.status(status.OK).json(
                        {
                            message: "PASSWORD LENGTH MUST BE MORE THAN 6 DIGITS!",
                            status: false,
                            code: 411
                        }
                    )

                }

            } else {

                res.status(status.OK).json(
                    {
                        message: "PASSWORD & CONFIRM PASSWORD DOES NOT MATCH!",
                        status: false,
                        code: 401
                    }
                )

            }

        }
    } catch (error) {

        console.log("companyRegistration::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Company Registration ----- */


/* ----- Company Login ----- */
exports.companyLogin = async (req, res) => {
    try {

        const data = await Company.findOne({ email: req.body.email })
        if (data) {

            bcrypt.compare(req.body.password, data.password, async (err, comparePassword) => {

                if (comparePassword) {

                    const token = await data.generateauthtoken()
                    res.cookie("jwt", token, {
                        expires: new Date(Date.now() + 300000 * 3),
                        httpOnly: true
                    })

                    const updateToken = await Company.findByIdAndUpdate({ _id: data._id },
                        {
                            $set: { token: token }
                        })

                    res.status(status.OK).json(
                        {
                            message: "COMPANY LOGIN SUCCESSFULLY !",
                            status: true,
                            code: 200,
                            token: token
                        }
                    )

                } else {

                    res.status(status.OK).json(
                        {
                            message: "INVALID CREDENCIAL !",
                            status: false,
                            code: 401
                        }
                    )

                }

            })
        } else {

            res.status(status.OK).json(
                {
                    message: "EMAIL DOES NOT REGISTER !",
                    status: false,
                    code: 401
                }
            )

        }
    } catch (error) {

        console.log("companyLogin::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Company Login ----- */


/* ----- Company Profile ----- */
exports.companyProfile = async (req, res) => {
    try {

        id = req.user._id;

        const profileData = await Company.findOne({ _id: id });

        if (profileData) {

            res.status(status.OK).json(
                {
                    message: "COMPANY PROFILE VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: profileData
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "COMPANY NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("companyProfile::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Company Profile ----- */


/* ----- Company Profile Update ----- */
exports.companyProfileUpdate = async (req, res) => {
    try {

        id = req.user._id;

        const profileData = await Company.findOne({ _id: id });

        if (profileData) {

            if (req.file == undefined) {

                const updateData = await Company.findOneAndUpdate({ _id: id },
                    {
                        $set: {
                            name: req.body.name,
                            type: req.body.type,
                            industry_type: req.body.industry_type,
                            no_of_emp: req.body.no_of_emp,
                            your_name: req.body.your_name,
                            your_role: req.body.your_role,
                            mobile: req.body.mobile,
                            whats_app: req.body.whats_app,
                            wallet: req.body.wallet,
                            city: req.body.city,
                            state: req.body.state,
                            country: req.body.country
                        }
                    }).then(() => {

                        res.status(status.OK).json(
                            {
                                message: "COMPANY PROFILE UPDATED SUCCESSFULLY !",
                                status: true,
                                code: 200
                            }
                        )

                    })

            } else {

                const cloudinaryImageUploadMethod = async file => {
                    return new Promise(resolve => {
                        cloudinary.uploader.upload(file, (err, res) => {
                            if (err) return err
                            resolve({
                                res: res.secure_url
                            })
                        })
                    })
                }

                const files = req.file;

                const newPath = await cloudinaryImageUploadMethod(files.path);

                const updateData = await Company.findOneAndUpdate({ _id: id },
                    {
                        $set: {
                            name: req.body.name,
                            image: newPath.res,
                            type: req.body.type,
                            industry_type: req.body.industry_type,
                            no_of_emp: req.body.no_of_emp,
                            your_name: req.body.your_name,
                            your_role: req.body.your_role,
                            mobile: req.body.mobile,
                            whats_app: req.body.whats_app,
                            wallet: req.body.wallet,
                            city: req.body.city,
                            state: req.body.state,
                            country: req.body.country
                        }
                    }).then(() => {

                        res.status(status.OK).json(
                            {
                                message: "COMPANY PROFILE UPDATED SUCCESSFULLY !",
                                status: true,
                                code: 200
                            }
                        )

                    })

            }



        } else {

            res.status(status.OK).json(
                {
                    message: "COMPANY DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("companyProfileUpdate::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Company Profile Update ----- */


/* ----- Change Password ----- */
exports.changePassword = async (req, res) => {
    try {

        id = req.user._id;

        const companyData = await Company.findOne({ _id: id });

        if (companyData) {

            bcrypt.compare(req.body.oldPassword, companyData.password, async (err, comparePassword) => {

                if (comparePassword) {

                    if (req.body.newPassword == req.body.confirmPassword) {

                        const newPassword = req.body.newPassword;

                        if (newPassword.length >= 6) {

                            const updateData = await Company.findOneAndUpdate({ _id: id },
                                {
                                    $set: {
                                        password: bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(8), null)
                                    }
                                }).then(() => {

                                    res.status(status.OK).json(
                                        {
                                            message: "YOUR PASSWORD HAS BEEN CHANGED SUCCESSFULLY !",
                                            status: true,
                                            code: 200
                                        }
                                    )

                                })

                        } else {

                            res.status(status.OK).json(
                                {
                                    message: "PASSWORD LENGTH MUST BE MORE THAN 6 DIGITS !",
                                    status: false,
                                    code: 401
                                }
                            )

                        }

                    } else {

                        res.status(status.OK).json(
                            {
                                message: "NEW PASSWORD AND CONFIRM PASSWORD MUST BE SAME !",
                                status: false,
                                code: 401
                            }
                        )

                    }

                } else {

                    res.status(status.OK).json(
                        {
                            message: "OLD PASSWORD DOES NOT MATCH !",
                            status: false,
                            code: 401
                        }
                    )

                }

            })

        } else {

            res.status(status.OK).json(
                {
                    message: "COMPANY NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("changePassword::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Change Password ----- */


/* ----- Add Profile ----- */
exports.addProfile = async (req, res) => {
    try {

        id = req.user._id;

        const companyData = await Company.findOne({ _id: id });

        if (companyData) {

            const cloudinaryImageUploadMethod = async file => {
                return new Promise(resolve => {
                    cloudinary.uploader.upload(file, (err, res) => {
                        if (err) return err
                        resolve({
                            res: res.secure_url
                        })
                    })
                })
            }

            const files = req.file;

            const newPath = await cloudinaryImageUploadMethod(files.path);

            const updateData = await Company.findOneAndUpdate({ _id: id },
                {
                    $set: {
                        image: newPath.res
                    }
                }).then(() => {

                    res.status(status.OK).json(
                        {
                            message: "COMPANY PROFILE UPDATED SUCCESSFULLY !",
                            status: true,
                            code: 200
                        }
                    )

                })

        } else {

            res.status(status.OK).json(
                {
                    message: "COMPANY DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("addProfile::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Add Profile ----- */


/* ----- Remove Profile ----- */
exports.removeProfile = async (req, res) => {
    try {

        id = req.user._id;

        const companyData = await Company.findOne({ _id: id });

        if (companyData) {

            const rmimage = await Company.findOneAndUpdate({ _id: id }, {
                $unset: {
                    image: ""
                }
            })

            res.status(status.OK).json(
                {
                    message: "IMAGE DELETE SUCCESSFULLY !",
                    status: true,
                    code: 200
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "COMPANY DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("removeProfile::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Remove Profile ----- */


/* ----- how Many User Apply By Company ----- */
exports.howManyUserApplyByCom = async (req, res) => {
    try {

        id = req.user._id;

        const applyInternshipUserData = await Applies.find({ company_id: id, types: 1 }).count();
        const applyJobUserData = await Applies.find({ company_id: id, types: 2 }).count();

        res.status(status.OK).json({
            message: "NUMBER OF USER APPLY IN OUR SYSTEM",
            status: true,
            code: 200,
            internship_data: applyInternshipUserData,
            jod_data: applyJobUserData
        })

    } catch (error) {

        console.log("howManyUserApplyByCom::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End how Many User Apply By Company ----- */


/* ----- get All Applied User ----- */
exports.getAllAppliedUser = async (req, res) => {
    try {

        id = req.user._id;

        const applyUserData = await Applies.find({ company_id: id });

        res.status(status.OK).json({
            message: "APPLIED USER DITALES VIEW SUCCESSFULLY",
            status: true,
            code: 200,
            data: applyUserData
        })

    } catch (error) {

        console.log("getAllAppliedUser::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End get All Applied User ----- */


/* ----- View All Company ----- */
exports.viewAllCompany = async (req, res) => {
    try {

        const findData = await Company.find({})

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "COMPANY NOT EXIST!",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "COMPANY VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("viewAllCompany::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End View All Company ----- */


/* ----- delete Compnay ----- */
exports.deleteCompnay = async (req, res) => {
    try {

        const adminId = req.user;

        bcrypt.compare(req.body.password, adminId.password, async (err, comparePassword) => {

            if (comparePassword) {

                const findCompnayData = await Company.findOne({ _id: req.params.id });

                if (findCompnayData) {

                    const deleteCompnay = await Company.deleteOne({ _id: req.params.id });
                    const deleteJob = await Jobs.deleteMany({ company_id: req.params.id });
                    const deleteInternship = await Internship.deleteMany({ company_id: req.params.id });
                    const deleteApplies = await Applies.deleteMany({ company_id: req.params.id });
                    const deleteHired = await Hired.deleteMany({ company_id: req.params.id });

                    res.status(status.OK).json(
                        {
                            message: "COMPANY DELETE SUCCESSFULLY !",
                            status: true,
                            code: 200
                        }
                    )

                } else {

                    res.status(status.OK).json(
                        {
                            message: "COMAPANY DOES NOT FOUND!",
                            status: true,
                            code: 404
                        }
                    )

                }

            } else {

                res.status(status.OK).json(
                    {
                        message: "INVALID CREDENCIAL !",
                        status: false,
                        code: 401
                    }
                )

            }

        })

    } catch (error) {

        console.log("deleteCompnay::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End delete Compnay ----- */


/* ----- all Count For Company ----- */
exports.allCountForCompany = async (req, res) => {
    try {

        const company = req.user

        const findCompany = await Company.findOne({ _id: company._id })

        if(findCompany) {

            const findJobCount = await Jobs.find({ company_id: company._id }).count()
            const findInternshipCount = await Internship.find({ company_id: company._id }).count()
            const findHiredCount = await Hired.find({ company_id: company._id }).count()
            const findInternshipAppliesCount = await Applies.find({ company_id: company._id , types: 1 }).count()
            const findJobAppliesCount = await Applies.find({ company_id: company._id , types: 2 }).count()

            res.status(status.OK).json(
                {
                    message: "VIEW COUNT SUCCESSFULLY!",
                    status: true,
                    code: 200,
                    data: {
                        jobCount : findJobCount,
                        internshipCount : findInternshipCount,
                        hiredCount : findHiredCount,
                        internshipAppliesCount: findInternshipAppliesCount,
                        jobAppliesCount: findJobAppliesCount,
                    }
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "COMPANY DOES NOT FOUND!",
                    status: false,
                    code: 404
                }
            )

        }
        
    } catch (error) {

        console.log("allCountForCompany::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })
        
    }
}
/* ----- End all Count For Company ----- */