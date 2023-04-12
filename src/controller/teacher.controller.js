const Teacher = require("../model/teacher.model");
const Courses = require("../model/courses.model");
const Transaction = require("../model/transaction.model");
const status = require('http-status');
const bcrypt = require("bcrypt");
const cloudinary = require("../util/cloudinary.util");
const { sendEmail } = require("../helper/mail.services");
const nodemailer = require("nodemailer");


/* ----- Teacher Insert ----- */
exports.addTeacherData = async (req, res) => {
    try {
        const data = await Teacher.findOne({ email: req.body.email })

        // generate 8 digite code
        var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var passwordLength = 7;
        var unique = "";
        for (var i = 0; i <= passwordLength; i++) {
            var randomNumber = Math.floor(Math.random() * chars.length);
            unique += chars.substring(randomNumber, randomNumber + 1);
        }
        console.log("unique", unique);

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

                    if (req.file == undefined) {

                        const teacherDetails = new Teacher({
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            email: req.body.email,
                            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
                            phone_code: req.body.phone_code,
                            mobile: req.body.mobile,
                            position: req.body.position,
                            experience: req.body.experience,
                            unique_code: unique,
                            status: req.body.status
                        })
                        const saveData = await teacherDetails.save()

                        // mail content
                        let subject = "Teacher Registeration Verify";
                        let content = { "first_name": saveData.first_name, "last_name": saveData.last_name, "email": saveData.email, "password": password };
                        let filePath = '/home/kurm/web Design/All Work/node js/teachLancer/views/teacherRegisterMail.ejs'

                        await sendEmail(saveData.email, subject, content, filePath)

                        res.status(status.CREATED).json(
                            {
                                message: "TEACHER INSERT SUCCESSFULLY !",
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

                        const teacherDetails = new Teacher({
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            email: req.body.email,
                            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
                            phone_code: req.body.phone_code,
                            mobile: req.body.mobile,
                            profile: newPath.res,
                            position: req.body.position,
                            experience: req.body.experience,
                            unique_code: unique,
                            status: req.body.status
                        })
                        const saveData = await teacherDetails.save()

                        // mail content
                        let subject = "Teacher Registeration Verify";
                        let content = { "first_name": saveData.first_name, "last_name": saveData.last_name, "email": saveData.email, "password": password };
                        let filePath = '/home/kurm/web Design/All Work/node js/teachLancer/views/teacherRegisterMail.ejs'

                        await sendEmail(saveData.email, subject, content, filePath)

                        res.status(status.CREATED).json(
                            {
                                message: "TEACHER INSERT SUCCESSFULLY !",
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

        console.log("addTeacherData::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Teacher Insert ----- */


/* ----- Teacher Login ----- */
exports.teacherLogin = async (req, res) => {
    try {

        const data = await Teacher.findOne({ email: req.body.email })
        console.log("data", data);

        if (data) {
            console.log("req.body.password", req.body.password);
            bcrypt.compare(req.body.password, data.password, async (err, comparePassword) => {

                if (comparePassword) {

                    const token = await data.generateauthtoken()
                    res.cookie("jwt", token, {
                        expires: new Date(Date.now() + 300000 * 3),
                        httpOnly: true
                    })

                    const updateToken = await Teacher.findByIdAndUpdate({ _id: data._id },
                        {
                            $set: { token: token }
                        })

                    const findCourseData = await Courses.findOne({ unique_code: data.unique_code });
                    console.log("findCourseData", findCourseData);

                    if (findCourseData) {

                        res.status(status.OK).json(
                            {
                                message: "TEACHER LOGIN SUCCESSFULLY !",
                                status: true,
                                code: 200,
                                teacher_id: data._id,
                                teacher_profile: data.profile,
                                token: token,
                                unique_code: data.unique_code,
                                course_id: findCourseData._id
                            }
                        )

                    } else {

                        res.status(status.OK).json(
                            {
                                message: "TEACHER LOGIN SUCCESSFULLY !",
                                status: true,
                                code: 200,
                                teacher_id: data._id,
                                teacher_profile: data.profile,
                                token: token,
                                unique_code: data.unique_code
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

        console.log("teacherLogin::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Teacher Login ----- */


/* ----- Teacher Update ----- */
exports.updateTeacherData = async (req, res) => {
    try {

        const findData = await Teacher.findOne({ _id: req.params.id });

        if (findData) {

            if (req.file == undefined) {

                const updateData = await Teacher.findOneAndUpdate({ _id: req.params.id },
                    {
                        $set: {
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            phone_code: req.body.phone_code,
                            mobile: req.body.mobile,
                            position: req.body.position,
                            experience: req.body.experience,
                            status: req.body.status
                        }
                    }).then(() => {

                        res.status(status.OK).json(
                            {
                                message: "TEACHER DETAILS UPDATED SUCCESSFULLY !",
                                status: true,
                                code: 200
                            }
                        )

                    }).catch((error) => {
                        console.log("error", error);
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

                const updateData = await Teacher.findOneAndUpdate({ _id: req.params.id },
                    {
                        $set: {
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            phone_code: req.body.phone_code,
                            mobile: req.body.mobile,
                            profile: newPath.res,
                            position: req.body.position,
                            experience: req.body.experience,
                            status: req.body.status
                        }
                    }).then(() => {

                        res.status(status.OK).json(
                            {
                                message: "TEACHER DETAILS UPDATED SUCCESSFULLY !",
                                status: true,
                                code: 200
                            }
                        )

                    }).catch((error) => {
                        console.log("error", error);
                    })

            }

        } else {

            res.status(status.OK).json(
                {
                    message: "TEACHER DOES NOT FOUND !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("updateTeacherData::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Teacher Update ----- */


/* ----- Teacher Profile View ----- */
exports.getTeacherProfile = async (req, res) => {
    try {

        const teacherData = await Teacher.findOne({ _id: req.params.id });

        if (teacherData) {

            res.status(status.OK).json(
                {
                    message: "TEACHER PROFILE VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: teacherData
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "TEACHER NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("getTeacherProfile::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- Teacher Profile View ----- */


/* ----- All Teacher List ----- */
exports.viewAllTeacherData = async (req, res) => {
    try {

        const findData = await Teacher.find({});

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "TEACHER DETAILS DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "TEACHER DETAILS SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("viewAllTeacherData::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End All Teacher List ----- */


/* ----- delete Teacher ----- */
exports.deleteTeacher = async (req, res) => {
    try {

        const adminId = req.user;

        bcrypt.compare(req.body.password, adminId.password, async (err, comparePassword) => {

            if (comparePassword) {

                const findTeacherData = await Teacher.findOne({ _id: req.params.id })

                if (findTeacherData) {

                    const deleteTeacher = await Teacher.deleteOne({ _id: req.params.id });
                    const deleteTransaction = await Transaction.deleteMany({ user_id: req.params.id }) 
                    const updateCourse = await Courses.updateMany({ unique_code: findTeacherData.unique_code },{
                        $set: {
                            status: 2
                        }
                    })

                    res.status(status.OK).json(
                        {
                            message: "TEACHER DELETE SUCCESSFULLY !",
                            status: true,
                            code: 200
                        }
                    )

                } else {

                    res.status(status.OK).json(
                        {
                            message: "TEACHER DOES NOT FOUND!",
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

        console.log("deleteTeacher::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End delete Teacher ----- */