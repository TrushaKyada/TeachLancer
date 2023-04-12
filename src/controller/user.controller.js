const User = require("../model/user.model");
const Transaction = require("../model/transaction.model");
const Internship = require("../model/internship.model");
const Lecture = require("../model/lecture.model");
const Hired = require("../model/hired.model")
const Jobs = require("../model/jobs.model");
const Courses = require("../model/courses.model");
const Carrer = require("../model/career.model");
const Applies = require("../model/applies.model");
const Enrolled = require("../model/enrolled.model");
const bcrypt = require("bcrypt");
const cloudinary = require("../util/cloudinary.util");
const status = require('http-status');
const nodemailer = require("nodemailer");
const { sendEmail } = require("../helper/mail.services");
const { email } = require("../config/data.config");


/* ----- User Registration ----- */
exports.userRegistration = async (req, res) => {
    try {
        const data = await User.findOne({ email: req.body.email })

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

            let password = req.body.password;
            let confirmPassword = req.body.confirmPassword

            if (password == confirmPassword) {

                if (password.length >= 6) {

                    const userDetails = new User({
                        first_name: req.body.first_name,
                        email: req.body.email,
                        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
                        mobile: req.body.mobile,
                        whats_app: req.body.whats_app,
                        wallet: req.body.wallet
                    })
                    const saveData = await userDetails.save()

                    // mail content
                    let subject = "User Registeration Verify";
                    let content = { "userName": saveData.first_name, "email": saveData.email };
                    let filePath = '/home/kurm/web Design/All Work/node js/teachLancer/views/registerMail.ejs'

                    await sendEmail(saveData.email, subject, content, filePath)

                    res.status(status.CREATED).json(
                        {
                            message: "CHECK YOUR MAIL AND VERIFY THAT YOU ARE REGISTERED OR NOT !",
                            status: true,
                            code: 201,
                            data: saveData
                        }
                    )

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

        console.log("userRegistration::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End User Registration ----- */


/* ----- User Login ----- */
exports.userLogin = async (req, res) => {
    try {

        const data = await User.findOne({ email: req.body.email })

        if (data) {

            bcrypt.compare(req.body.password, data.password, async (err, comparePassword) => {

                if (comparePassword) {

                    const token = await data.generateauthtoken()
                    res.cookie("jwt", token, {
                        expires: new Date(Date.now() + 300000 * 3),
                        httpOnly: true
                    })

                    const updateToken = await User.findByIdAndUpdate({ _id: data._id },
                        {
                            $set: { token: token }
                        })

                    res.status(status.OK).json(
                        {
                            message: "USER LOGIN SUCCESSFULLY !",
                            status: true,
                            code: 200,
                            token: token,
                            user_id: data._id
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

        console.log("userLogin::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End User Login ----- */


/* ----- User Profile View ----- */
exports.userProfile = async (req, res) => {
    try {

        id = req.user._id;

        const profileData = await User.findOne({ _id: id });

        if (profileData) {

            res.status(status.OK).json(
                {
                    message: "USER PROFILE VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: profileData
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "USER NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("userProfile::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- User Profile View ----- */


/* ----- User Profile Update ----- */
exports.userProfileUpdate = async (req, res) => {
    try {

        id = req.user._id;

        const profileData = await User.findOne({ _id: id });

        if (profileData) {

            if (req.file == undefined) {

                const updateData = await User.findOneAndUpdate({ _id: id },
                    {
                        $set: {
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            gender: req.body.gender,
                            phone_code: req.body.phone_code,
                            mobile: req.body.mobile,
                            whats_app: req.body.whats_app,
                            city: req.body.city,
                            second_city: req.body.second_city,
                            mother_tongue: req.body.mother_tongue,
                            language: req.body.language,
                            linkedin_profile: req.body.linkedin_profile,
                            about_yourself: req.body.about_yourself,
                            wallet: req.body.wallet
                        }
                    }).then(() => {

                        res.status(status.OK).json(
                            {
                                message: "USER PROFILE UPDATED SUCCESSFULLY !",
                                status: true,
                                code: 200
                            }
                        )

                    })

            } else {

                const cloudinaryImageUploadMethod = async file => {
                    return new Promise(resolve => {
                        cloudinary.uploader.upload(file, (err, res) => {
                            // {resource_type: "auto"}
                            if (err) return err
                            resolve({
                                res: res.secure_url
                            })
                        })
                    })
                }

                const files = req.file;

                const newPath = await cloudinaryImageUploadMethod(files.path);

                const updateData = await User.findOneAndUpdate({ _id: id },
                    {
                        $set: {
                            profile: newPath.res,
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            gender: req.body.gender,
                            phone_code: req.body.phone_code,
                            mobile: req.body.mobile,
                            whats_app: req.body.whats_app,
                            city: req.body.city,
                            second_city: req.body.second_city,
                            mother_tongue: req.body.mother_tongue,
                            language: req.body.language,
                            linkedin_profile: req.body.linkedin_profile,
                            about_yourself: req.body.about_yourself,
                            wallet: req.body.wallet
                        }
                    }).then(() => {

                        res.status(status.OK).json(
                            {
                                message: "USER PROFILE UPDATED SUCCESSFULLY !",
                                status: true,
                                code: 200
                            }
                        )

                    })

            }

        } else {

            res.status(status.OK).json(
                {
                    message: "USER DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("userProfileUpdate::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End User Profile Update ----- */


/* ----- Change Password ----- */
exports.changePassword = async (req, res) => {
    try {

        id = req.user._id;

        const userData = await User.findOne({ _id: id });

        if (userData) {

            bcrypt.compare(req.body.oldPassword, userData.password, async (err, comparePassword) => {

                if (comparePassword) {

                    if (req.body.newPassword == req.body.confirmPassword) {

                        const newPassword = req.body.newPassword;

                        if (newPassword.length >= 6) {

                            const updateData = await User.findOneAndUpdate({ _id: id },
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
                    code: 404,
                    statusCode: 0
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

        const userData = await User.findOne({ _id: id });

        if (userData) {

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

            const updateData = await User.findOneAndUpdate({ _id: id },
                {
                    $set: {
                        profile: newPath.res
                    }
                }).then(() => {

                    res.status(status.OK).json(
                        {
                            message: "USER PROFILE UPDATED SUCCESSFULLY !",
                            status: true,
                            code: 200
                        }
                    )

                })

        } else {

            res.status(status.OK).json(
                {
                    message: "USER DOES NOT EXISTS !",
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

        const userData = await User.findOne({ _id: id });

        if (userData) {

            const rmimage = await User.findOneAndUpdate({ _id: id }, {
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
                    message: "USER DOES NOT EXISTS !",
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


/* ----- View All User ----- */
exports.viewAllUser = async (req, res) => {
    try {

        const findData = await User.find({})

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "USER NOT EXIST!",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "USER VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("viewAllUser::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End View All Company ----- */


/* ----- delete User ----- */
exports.deleteUser = async (req, res) => {
    try {

        const adminId = req.user;

        bcrypt.compare(req.body.password, adminId.password, async (err, comparePassword) => {

            if (comparePassword) {

                const findUserData = await User.findOne({ _id: req.params.id });

                if (findUserData) {

                    const deleteUser = await User.deleteOne({ _id: req.params.id })
                    const deleteCarrer = await Carrer.deleteMany({ user_id: req.params.id });
                    const deleteApplies = await Applies.deleteMany({ user_id: req.params.id });
                    const deleteEnrolled = await Enrolled.deleteMany({ user_id: req.params.id });
                    const deleteTransaction = await Transaction.deleteMany({ user_id: req.params.id }) 

                    res.status(status.OK).json(
                        {
                            message: "USER DELETE SUCCESSFULLY !",
                            status: true,
                            code: 200
                        }
                    )

                } else {

                    res.status(status.OK).json(
                        {
                            message: "USER DOES NOT FOUND!",
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

        console.log("deleteUser::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End delete User ----- */


/* ----- User View By Id ----- */
exports.viewUserById = async (req, res) => {
    try {

        const profileData = await User.findOne({ _id: req.params.id });

        if (profileData) {

            res.status(status.OK).json(
                {
                    message: "USER PROFILE VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: profileData
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "USER NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("viewUserById::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End User View By Id ----- */


/* ----- User Info For Dashbord ----- */
exports.userInfoForDashbord = async (req, res) => {
    try {

        const user = req.user
        console.log("user", user);

        const profileData = await User.findOne({ _id: user._id });

        if (profileData) {

            const enrolledData = await Enrolled.find({ user_id: user._id })

            const coursesData = []
            for (const data of enrolledData) {
                const lectureCount = await Lecture.find({ code: data.code }).count()
                const response = {
                    course_title: data.course_title,
                    lecture_count: lectureCount,
                    status: data.status
                }
                coursesData.push(response)
            }

            const appliesInternshipData = await Applies.find({ user_id: user._id, types: 1 })

            const internshipData = []
            for (const data of appliesInternshipData) {
                const findInternship = await Internship.findOne({ _id: data.work_id })
                const response = {
                    company_name : findInternship.company_name,
                    company_city: data.company_city,
                    status: findInternship.active
                }
                internshipData.push(response)
            }

            const appliesJobData = await Applies.find({ user_id: user._id, types: 2 })

            const jobData = []
            for (const data of appliesJobData) {
                const findJob = await Jobs.findOne({ _id: data.work_id })
                const response = {
                    position: findJob.position,
                    company_name : findJob.company_name,
                    company_city: data.company_city,
                    status: findJob.active
                }
                jobData.push(response)
            }

            const findHiredData = await Hired.find({ user_id: user._id })

            const hiredData = []
            for (const data of findHiredData) {
                const appliesData = await Applies.find({ _id: data.applies_id })
                const response = {
                    compnay_name: data.compnay_name
                }
                hiredData.push(response)
            }

            res.status(status.OK).json(
                {
                    message: "ALL INFORMATION VIEW SUCCESSFULLY!",
                    status: true,
                    code: 200,
                    data: {
                        coursesData: coursesData,
                        internshipData: internshipData,
                        jobData: jobData,
                        hiredData: hiredData
                    }
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "USER NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("viewUserById::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End User Info For Dashbord ----- */