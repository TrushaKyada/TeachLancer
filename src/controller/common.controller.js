const User = require("../model/user.model");
const Academy = require("../model/admin.model");
const Company = require("../model/company.model");
const { sendEmail } = require("../helper/mail.services");
const status = require("http-status");
const bcrypt = require("bcrypt");


/* ----- forget password ----- */
exports.forgetPassword = async (req, res) => {
    try {

        let email = req.body.email;
        let role = req.body.role;

        var data;
        var token;
        if (role == 1) {
            data = await User.findOne({ email: email });
        }

        if (role == 2) {
            data = await Academy.findOne({ email: email });
        }

        if (role == 3) {
            data = await Company.findOne({ email: email });
        }

        if (data) {

            if (role == 1) {
                token = await data.generateauthtoken();

                const updateData = await User.findOneAndUpdate(
                    {
                        _id: data._id
                    }, {
                    $set: {
                        token: token
                    }
                })
            }

            if (role == 2) {
                token = await data.generateauthtoken();

                const updateData = await Academy.findOneAndUpdate(
                    {
                        _id: data._id
                    }, {
                    $set: {
                        token: token
                    }
                })
            }

            if (role == 3) {
                token = await data.generateauthtoken();

                const updateData = await Company.findOneAndUpdate(
                    {
                        _id: data._id
                    }, {
                    $set: {
                        token: token
                    }
                })
            }

            // mail content
            let subject = "Reset Your Password";
            let content = { "token": token, "role": role };
            let filePath = '/home/kurm/web Design/All Work/node js/teachLancer/views/resetMail.ejs'

            await sendEmail(data.email, subject, content, filePath)

            res.status(status.OK).json({
                message: "MAIL SEND SUCCESSFULLY",
                status: true,
                code: 200
            })

        } else {

            res.status(status.OK).json({
                message: "USER NOT FOUND",
                status: false,
                code: 404
            })

        }
    } catch (error) {

        console.log("forgetPassword::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- end forget password ----- */


/* ----- reset password ----- */
exports.resetPassword = async (req, res) => {
    try {

        let token = req.params.token;
        let role = req.params.role;
        let newPass = req.body.newPassword;
        let confPass = req.body.confirmPassword;

        if (role == undefined) {

            res.status(status.OK).json({

                message: "YOUR ROLE IS NOT DEFINE",
                status: false,
                code: 422

            })

        } else {

            if (role == 1) {

                const findData = await User.findOne({ token: token });

                if (findData) {

                    if (newPass == confPass) {

                        if (newPass.length >= 6) {

                            const updateData = await User.findOneAndUpdate({ _id: findData._id },
                                {
                                    $set: {
                                        password: bcrypt.hashSync(newPass, bcrypt.genSaltSync(8), null)
                                    }
                                }).then(() => {

                                    res.status(status.OK).json(
                                        {
                                            message: "YOUR PASSWORD RESET SUCCESSFULLY !",
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
                            message: "USER NOT FOUND",
                            status: false,
                            code: 404
                        }
                    )

                }
            }

            if (role == 2) {

                const findData = await Academy.findOne({ token: token });
                if (findData) {

                    if (newPass == confPass) {

                        if (newPass.length >= 6) {

                            const updateData = await Academy.findOneAndUpdate({ _id: findData._id },
                                {
                                    $set: {
                                        password: bcrypt.hashSync(newPass, bcrypt.genSaltSync(8), null)
                                    }
                                }).then(() => {

                                    res.status(status.OK).json(
                                        {
                                            message: "YOUR PASSWORD RESET SUCCESSFULLY !",
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
                            message: "ACADEMY NOT FOUND",
                            status: false,
                            code: 404
                        }
                    )

                }
            }

            if (role == 3) {

                const findData = await Company.findOne({ token: token });
                if (findData) {

                    if (newPass == confPass) {

                        if (newPass.length >= 6) {

                            const updateData = await Company.findOneAndUpdate({ _id: findData._id },
                                {
                                    $set: {
                                        password: bcrypt.hashSync(newPass, bcrypt.genSaltSync(8), null)
                                    }
                                }).then(() => {

                                    res.status(status.OK).json(
                                        {
                                            message: "YOUR PASSWORD RESET SUCCESSFULLY !",
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
                            message: "COMPANY NOT FOUND",
                            status: false,
                            code: 404
                        }
                    )

                }
            }

        }

    } catch (error) {

        console.log("resetPassword::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- end reset password ----- */

