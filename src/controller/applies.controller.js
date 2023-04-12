const Applies = require("../model/applies.model");
const Company = require("../model/company.model");
const User = require("../model/user.model");
const Hired = require("../model/hired.model")
const Internship = require("../model/internship.model");
const Jobs = require("../model/jobs.model");
const status = require('http-status');
const { sendEmail } = require("../helper/mail.services");
const { google } = require('googleapis');


/* ----- Apply Internship ----- */
exports.applyInternship = async (req, res) => {
    try {

        const userData = req.user

        const internshipData = await Internship.findOne({ _id: req.params.id })

        if (internshipData) {

            const checkData = await Applies.findOne({ work_id: req.params.id, user_id: userData._id })

            if (checkData) {

                res.status(status.OK).json(
                    {
                        message: "YOU HAVE ALREADY APPLIED THIS INTERNSHIP !",
                        status: false,
                        code: 401
                    }
                )

            } else {
                const userName = `${userData.first_name} ${userData.last_name ? userData.last_name : ''}`;

                const applyData = new Applies({
                    types: 1,
                    user_id: userData._id,
                    company_id: internshipData.company_id,
                    work_id: internshipData._id,
                    company_name: internshipData.company_name,
                    company_city: internshipData.address,
                    username: userName.trim(),
                    user_email: userData.email
                })
                const saveData = await applyData.save();

                res.status(status.CREATED).json(
                    {
                        message: "APPLY INTERNSHIP DETAILS INSERT SUCCESSFULLY !",
                        status: true,
                        code: 201,
                        data: saveData
                    }
                )

            }

        } else {

            res.status(status.OK).json(
                {
                    message: "INTERNSHIP DETAILS NOT EXIST !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("applyInternship::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Apply Internship ----- */


/* ----- Apply Jobs ----- */
exports.applyJob = async (req, res) => {
    try {

        const userData = req.user

        const jobData = await Jobs.findOne({ _id: req.params.id })

        if (jobData) {

            const checkData = await Applies.findOne({ work_id: req.params.id, user_id: userData._id })

            if (checkData) {

                res.status(status.OK).json(
                    {
                        message: "YOU HAVE ALREADY APPLIED THIS JOB !",
                        status: false,
                        code: 401
                    }
                )

            } else {
                const userName = `${userData.first_name} ${userData.last_name ? userData.last_name : ''}`;

                const applyData = new Applies({
                    types: 2,
                    user_id: userData._id,
                    company_id: jobData.company_id,
                    work_id: jobData._id,
                    company_name: jobData.company_name,
                    company_city: jobData.address,
                    username: userName.trim(),
                    user_email: userData.email,
                    position: jobData.position
                })
                const saveData = await applyData.save()

                res.status(status.CREATED).json(
                    {
                        message: "APPLY JOB DETAILS INSERT SUCCESSFULLY !",
                        status: true,
                        code: 201,
                        data: saveData
                    }
                )

            }

        } else {

            res.status(status.OK).json(
                {
                    message: "JOB DETAILS NOT EXIST !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("applyJob::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Apply Jobs ----- */


/* ----- Get Applies Internship By User Token ----- */
exports.getAppliesInternshipByUserToken = async (req, res) => {
    try {

        const id = req.user._id

        const appliesData = await Applies.find({ user_id: id, types: 1 })

        if (appliesData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "INTERNSHIP DETAILS NOT EXIST !",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "APPLY INTERNSHIP DETAILS VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: appliesData
                }
            )

        }

    } catch (error) {

        console.log("getAppliesInternshipByUserToken::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Get Applies Internship By User Token ----- */


/* ----- Get Applies Job By User Token ----- */
exports.getAppliesJobsByUserToken = async (req, res) => {
    try {

        const id = req.user._id

        const appliesData = await Applies.find({ user_id: id, types: 2 })

        if (appliesData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "JOB DETAILS NOT EXIST !",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "APPLY JOB DETAILS VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: appliesData
                }
            )

        }

    } catch (error) {

        console.log("getAppliesJobsByUserToken::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Get Applies JOb By User Token ----- */


/* ----- Get Applies Internship By UserId ----- */
exports.getAppliesInternshipByUserId = async (req, res) => {
    try {

        const appliesData = await Applies.find({ user_id: req.params.id, types: 1 })

        if (appliesData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "INTERNSHIP DETAILS NOT EXIST !",
                    status: false,
                    code: 404,
                    data: []
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "APPLY INTERNSHIP DETAILS VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: appliesData
                }
            )

        }

    } catch (error) {

        console.log("getAppliesInternshipByUserId::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Get Applies Internship By UserId ----- */


/* ----- Get Applies Job By User Id ----- */
exports.getAppliesJobsByUserId = async (req, res) => {
    try {

        const appliesData = await Applies.find({ user_id: req.params.id, types: 2 })

        if (appliesData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "JOB DETAILS NOT EXIST !",
                    status: false,
                    code: 404,
                    data: []
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "APPLY JOB DETAILS VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: appliesData
                }
            )

        }

    } catch (error) {

        console.log("getAppliesJobsByUserId::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Get Applies JOb By User Id ----- */


/* ----- list Apply User In Job ----- */
exports.listApplyInJob = async (req, res) => {
    try {

        const companyId = req.user._id;

        const appliesData = await Applies.find({ work_id: req.params.jod_id, company_id: companyId, types: 2 });

        if (appliesData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "NO USER HAS APPLIED!",
                    status: false,
                    code: 404
                }
            )

        } else {

            var userArr = []
            for (const userData of appliesData) {

                const userList = await User.findOne({ _id: userData.user_id })

                const response = {
                    _id: userList._id,
                    profile: userList.profile,
                    first_name: userList.first_name,
                    last_name: userList.last_name,
                    email: userList.email,
                    password: userList.password,
                    gender: userList.gender,
                    phone_code: userList.phone_code,
                    mobile: userList.mobile,
                    whats_app: userList.whats_app,
                    city: userList.city,
                    second_city: userList.second_city,
                    mother_tongue: userList.mother_tongue,
                    language: userList.language,
                    linkedin_profile: userList.linkedin_profile,
                    about_yourself: userList.about_yourself,
                    wallet: userList.wallet,
                    token: userList.token,
                    createdAt: userList.createdAt,
                    updatedAt: userList.updatedAt,
                    hired_status: userData.status,
                    applied_id: userData._id
                }

                userArr.push(response)

            }

            res.status(status.OK).json(
                {
                    message: "APPLY USER DETAILS VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: userArr
                }
            )

        }

    } catch (error) {

        console.log("listApplyInJob::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End list Apply User In Job ----- */


/* ----- list Apply User In Intern ----- */
exports.listApplyInIntern = async (req, res) => {
    try {

        const companyId = req.user._id;

        const appliesData = await Applies.find({ work_id: req.params.intern_id, company_id: companyId, types: 1 });

        if (appliesData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "NO USER HAS APPLIED!",
                    status: false,
                    code: 404
                }
            )

        } else {

            var userArr = []
            for (const userData of appliesData) {

                const userList = await User.findOne({ _id: userData.user_id })

                const response = {
                    _id: userList._id,
                    profile: userList.profile,
                    first_name: userList.first_name,
                    last_name: userList.last_name,
                    email: userList.email,
                    password: userList.password,
                    gender: userList.gender,
                    phone_code: userList.phone_code,
                    mobile: userList.mobile,
                    whats_app: userList.whats_app,
                    city: userList.city,
                    second_city: userList.second_city,
                    mother_tongue: userList.mother_tongue,
                    language: userList.language,
                    linkedin_profile: userList.linkedin_profile,
                    about_yourself: userList.about_yourself,
                    wallet: userList.wallet,
                    token: userList.token,
                    createdAt: userList.createdAt,
                    updatedAt: userList.updatedAt,
                    hired_status: userData.status,
                    applied_id: userData._id
                }

                userArr.push(response)

            }

            res.status(status.OK).json(
                {
                    message: "APPLY USER DETAILS VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: userArr
                }
            )

        }

    } catch (error) {

        console.log("listApplyInIntern::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End list Apply User In Intern ----- */


/* ----- Take Action For Hired User From Job ----- */
exports.takeActionForJob = async (req, res) => {
    try {

        const companyId = req.user._id
        // console.log("companyId", companyId);

        const findAppliesData = await Applies.findOne({ _id: req.params.applied_id, company_id: companyId, types: 2 })
        // console.log("findAppliesData", findAppliesData);

        const findCompanyData = await Company.findOne({ _id: companyId });
        // console.log("findCompanyData", findCompanyData);

        if (findAppliesData) {

            // update status in applies table
            const updateData = await Applies.findOneAndUpdate({ _id: findAppliesData._id }, {
                $set: {
                    status: 2
                }
            })

            // mail content
            let subject = "For Interview Schedule";
            let content = { "userName": findAppliesData.username, "companyName": findAppliesData.company_name, "position" : findAppliesData.position };
            let filePath = '/home/kurm/web Design/All Work/node js/teachLancer/views/jobInterviewMail.ejs'

            await sendEmail(findAppliesData.user_email, subject, content, filePath);
            await sendEmail(findCompanyData.email, subject, content, filePath);

            const response = {
                user_id: findAppliesData.user_id,
                user_name: findAppliesData.username,
                user_email: findAppliesData.user_email
            }

            res.status(status.OK).json(
                {
                    message: "LINK GENERATED SUCCESSFULLY!",
                    status: true,
                    code: 200,
                    data: response
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "DATA NOT FOUND!",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("takeActionForJob::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Take Action For Hired User From Job ----- */


/* ----- Take Action For Hired User From Internship ----- */
exports.takeActionForIntern = async (req, res) => {
    try {

        const companyId = req.user._id
        console.log("companyId", companyId);

        const findAppliesData = await Applies.findOne({ _id: req.params.applied_id, company_id: companyId, types: 1 })
        console.log("findAppliesData", findAppliesData);

        const findCompanyData = await Company.findOne({ _id: companyId });
        console.log("findCompanyData", findCompanyData);

        if (findAppliesData) {

            // update status in applies table
            const updateData = await Applies.findOneAndUpdate({ _id: findAppliesData._id }, {
                $set: {
                    status: 2
                }
            })

            // mail content
            let subject = "For Interview Schedule";
            let content = { "userName": findAppliesData.username, "companyName": findAppliesData.company_name };
            let filePath = '/home/kurm/web Design/All Work/node js/teachLancer/views/internInterviewMail.ejs'

            await sendEmail(findAppliesData.user_email, subject, content, filePath);
            await sendEmail(findCompanyData.email, subject, content, filePath);

            const response = {
                user_id: findAppliesData.user_id,
                user_name: findAppliesData.username,
                user_email: findAppliesData.user_email
            }

            res.status(status.OK).json(
                {
                    message: "LINK GENERATED SUCCESSFULLY!",
                    status: true,
                    code: 200,
                    data: response
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "DATA NOT FOUND!",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("takeActionForIntern::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Take Action For Hired User From Internship ----- */


/* ----- Update Applies Status ----- */
exports.updateAppliesStatus = async (req, res) => {
    try {

        const companyId = req.user._id
        console.log("companyId", companyId);
        const findAppliesData = await Applies.findOne({ _id: req.params.id, company_id: companyId });
        console.log("findAppliesData", findAppliesData);

        if (findAppliesData) {

            const updateData = await Applies.findOneAndUpdate({ _id: findAppliesData._id }, {
                $set: {
                    status: req.body.status
                }
            })

            if (req.body.status == 3) {

                 // mail content
                 let subject = "For Infom To Hired";
                 let content = { "userName": findAppliesData.username, "companyName" : findAppliesData.company_name };
                 let filePath = '/home/kurm/web Design/All Work/node js/teachLancer/views/hiredMail.ejs'

                 await sendEmail(findAppliesData.user_email, subject, content, filePath)

            } else {

                // mail content
                let subject = "For Infom To Rejected";
                let content = { "userName": findAppliesData.username, "companyName" : findAppliesData.company_name };
                let filePath = '/home/kurm/web Design/All Work/node js/teachLancer/views/rejectionMail.ejs'

                await sendEmail(findAppliesData.user_email, subject, content, filePath)

            }

            res.status(status.OK).json(
                {
                    message: "STATUS UPDATE SUCCESSFULLY!",
                    status: true,
                    code: 200
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "APPLIES DATA NOT FOUND!",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("updateAppliesStatus::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Update Applies Status ----- */
