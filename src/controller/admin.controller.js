const Admin = require("../model/admin.model");
const Applies = require("../model/applies.model");
const User = require("../model/user.model");
const Courses = require("../model/courses.model");
const Company = require("../model/company.model")
const bcrypt = require("bcrypt");
const status = require('http-status');
const nodemailer = require("nodemailer");
const cloudinary = require("../util/cloudinary.util");


/* ----- Admin Login ----- */
exports.adminLogin = async (req, res) => {
    try {

        const data = await Admin.findOne({ email: req.body.email })

        if (data) {

            bcrypt.compare(req.body.password, data.password, async (err, comparePassword) => {

                if (comparePassword) {

                    const token = await data.generateauthtoken()
                    res.cookie("jwt", token, {
                        expires: new Date(Date.now() + 300000 * 3),
                        httpOnly: true
                    })

                    const updateToken = await Admin.findByIdAndUpdate({ _id: data._id },
                        {
                            $set: { token: token }
                        })

                    res.status(status.OK).json(
                        {
                            message: "ADMIN LOGIN SUCCESSFULLY !",
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

        console.log("adminLogin::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Admin Login ----- */


/* ----- Admin Profile View ----- */
exports.adminProfile = async (req, res) => {
    try {

        id = req.user._id;

        const profileData = await Admin.findOne({ _id: id });

        if (profileData) {

            res.status(status.OK).json(
                {
                    message: "ADMIN PROFILE VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: profileData
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "ADMIN NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("adminProfile::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500,
            error: error.message
        })

    }
}
/* ----- End Admin Profile View ----- */


/* ----- Academy Registration ----- */
exports.academyRegistration = async (req, res) => {
    try {
        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword

        const data = await Academy.findOne({ email: req.body.email });

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

            if (password == confirmPassword) {

                if (password.length >= 6) {

                    if (req.file == undefined) {

                        const academyDetails = new Academy({
                            name: req.body.name,
                            email: req.body.email,
                            phone_code: req.body.phone_code,
                            mobile: req.body.mobile,
                            whats_app: req.body.whats_app,
                            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
                        })
                        const saveData = await academyDetails.save()

                        res.status(status.CREATED).json(
                            {
                                message: "ACADEMY REGISTRATION SUCCESSFULLY !",
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

                        const academyDetails = new Academy({
                            profile: newPath.res,
                            name: req.body.name,
                            email: req.body.email,
                            phone_code: req.body.phone_code,
                            mobile: req.body.mobile,
                            whats_app: req.body.whats_app,
                            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
                        })
                        const saveData = await academyDetails.save()

                        res.status(status.CREATED).json(
                            {
                                message: "ACADEMY REGISTRATION SUCCESSFULLY !",
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

        console.log("academyRegistration::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Academy Registration ----- */


/* ----- Academy Profile Update ----- */
exports.academyProfileUpdate = async (req, res) => {
    try {

        id = req.user._id;

        const profileData = await Academy.findOne({ _id: id });

        if (profileData) {

            if (req.file == undefined) {

                const updateData = await Academy.findOneAndUpdate({ _id: id },
                    {
                        $set: {
                            name: req.body.name,
                            phone_code: req.body.phone_code,
                            mobile: req.body.mobile,
                            whats_app: req.body.whats_app
                        }
                    }).then(() => {

                        res.status(status.OK).json(
                            {
                                message: "ACADEMY PROFILE UPDATED SUCCESSFULLY !",
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

                const updateData = await Academy.findOneAndUpdate({ _id: id },
                    {
                        $set: {
                            profile: newPath.res,
                            name: req.body.name,
                            phone_code: req.body.phone_code,
                            mobile: req.body.mobile,
                            whats_app: req.body.whats_app
                        }
                    }).then(() => {

                        res.status(status.OK).json(
                            {
                                message: "ACADEMY PROFILE UPDATED SUCCESSFULLY !",
                                status: true,
                                code: 200
                            }
                        )

                    })

            }



        } else {

            res.status(status.OK).json(
                {
                    message: "ACADEMY DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("academyProfileUpdate::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Academy Profile Update ----- */


/* ----- Change Password ----- */
exports.changePassword = async (req, res) => {
    try {

        id = req.user._id;

        const academyData = await Academy.findOne({ _id: id });

        if (academyData) {

            bcrypt.compare(req.body.oldPassword, academyData.password, async (err, comparePassword) => {

                if (comparePassword) {

                    if (req.body.newPassword == req.body.confirmPassword) {

                        const newPassword = req.body.newPassword;

                        if (newPassword.length >= 6) {

                            const updateData = await Academy.findOneAndUpdate({ _id: id },
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
                    message: "ACADEMY NOT EXISTS !",
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

        const academyData = await Academy.findOne({ _id: id });

        if (academyData) {

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

            const updateData = await Academy.findOneAndUpdate({ _id: id },
                {
                    $set: {
                        profile: newPath.res
                    }
                }).then(() => {

                    res.status(status.OK).json(
                        {
                            message: "ACADEMY PROFILE UPDATED SUCCESSFULLY !",
                            status: true,
                            code: 200
                        }
                    )

                })

        } else {

            res.status(status.OK).json(
                {
                    message: "ACADEMY DOES NOT EXISTS !",
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

        const academyData = await Academy.findOne({ _id: id });

        if (academyData) {

            const rmimage = await Academy.findOneAndUpdate({ _id: id }, {
                $unset: {
                    profile: ""
                }
            })

            res.status(status.OK).json(
                {
                    message: "PROFILE DELETE SUCCESSFULLY !",
                    status: true,
                    code: 200
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "ACADEMY DOES NOT EXISTS !",
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


/* ----- How Many User ----- */
exports.howManyUser = async (req, res) => {
    try {

        const userData = await User.find().count();

        res.status(status.OK).json({
            message: "NUMBER OF USERS IN OUR SYSTEM",
            status: true,
            code: 200,
            data: userData
        })
        
    } catch (error) {

        console.log("howManyUser::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })
        
    }
}
/* ----- End How Many User ----- */


/* ----- How Many Companies ----- */
exports.howManyCompanies = async (req, res) => {
    try {

        const companyData = await Company.find().count();

        res.status(status.OK).json({
            message: "NUMBER OF COMPANIES IN OUR SYSTEM",
            status: true,
            code: 200,
            data: companyData
        })
        
    } catch (error) {

        console.log("howManyCompanies::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })
        
    }
}
/* ----- End How Many Companies ----- */


/* ----- How Many Course ----- */
exports.howManyCourse = async (req, res) => {
    try {

        const coursesData = await Courses.find().count();

        res.status(status.OK).json({
            message: "NUMBER OF COURSES IN OUR SYSTEM",
            status: true,
            code: 200,
            data: coursesData
        })
        
    } catch (error) {

        console.log("howManyCourse::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })
        
    }
}
/* ----- End How Many Course ----- */


/* ----- how Many User Apply ----- */
exports.howManyUserApply = async (req, res) => {
    try {

        const applyUserData = await Applies.find({ }).count();

        res.status(status.OK).json({
            message: "NUMBER OF USER APPLY IN OUR SYSTEM",
            status: true,
            code: 200,
            data: applyUserData
        })
        
    } catch (error) {

        console.log("howManyUserApply::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })
        
    }
}
/* ----- End how Many User Apply ----- */