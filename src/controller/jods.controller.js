const Jobs = require("../model/jobs.model");
const Applies = require("../model/applies.model");
const Hired = require("../model/hired.model")
const cloudinary = require("../util/cloudinary.util");
const status = require('http-status');
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");


/* ----- Post Job ----- */
exports.postJob = async (req, res) => {
    try {

        const company = req.user;

        var pattern = `^${req.body.position}`

        const findPositionData = await Jobs.find({ position: { $regex: pattern, $options: 'i' } });

        if (findPositionData[0] == undefined) {

            const jobsDetails = new Jobs({
                company_id: company._id,
                company_name: company.name,
                type: req.body.type,
                position: req.body.position,
                vacancy: req.body.vacancy,
                description: req.body.description,
                technology: req.body.technology,
                salary: req.body.salary,
                address: `${company.city}, ${company.state}, ${company.country}`,
                active: req.body.active
            })
            const saveData = await jobsDetails.save();

            res.status(status.CREATED).json(
                {
                    message: "JOBS POST SUCCESSFULLY !",
                    status: true,
                    code: 201,
                    data: saveData
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "JOB OF THIS TYPE IS AVAILABLE SO YOU CAN NOT INSERT JOB OF THIS TYPE!",
                    status: false,
                    code: 406
                }
            )

        }

    } catch (error) {

        console.log("postJob::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Post Job ----- */


/* ----- Update Job Details ----- */
exports.updateJobDetails = async (req, res) => {
    try {

        const company = req.user;

        const jobData = await Jobs.findOne({ _id: req.params.id });

        if (jobData) {

            const token_company_id = (company._id).toString()
            const job_company_id = (jobData.company_id).toString()

            if (token_company_id == job_company_id) {

                const updateData = await Jobs.findOneAndUpdate({ _id: req.params.id },
                    {
                        $set: {
                            company_id: company._id,
                            company_name: company.name,
                            type: req.body.type,
                            position: req.body.position,
                            vacancy: req.body.vacancy,
                            description: req.body.description,
                            technology: req.body.technology,
                            salary: req.body.salary,
                            address: `${company.city}, ${company.state}, ${company.country}`,
                            active: req.body.active
                        }
                    }).then(() => {

                        res.status(status.OK).json(
                            {
                                message: "JOB UPDATED SUCCESSFULLY !",
                                status: true,
                                code: 200
                            }
                        )

                    })

            } else {

                res.status(status.OK).json(
                    {
                        message: "YOU CAN NOT UPDATE THIS INTERNSHIP !",
                        status: false,
                        code: 406
                    }
                )

            }

        } else {

            res.status(status.OK).json(
                {
                    message: "JOB DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("updateJobDetails::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Update Job Details ----- */


/* ----- All Job List ----- */
exports.allJobList = async (req, res) => {
    try {

        const findData = await Jobs.find({});

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "JOBS DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "JOBS VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("allJobList::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End All Job List ----- */


/* ----- View Job Details By Id ----- */
exports.viewJobDetails = async (req, res) => {
    try {

        const findData = await Jobs.findOne({ _id: req.params.id });

        if (findData) {

            res.status(status.OK).json(
                {
                    message: "JOBS VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "JOBS DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("viewJobDetails::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End View Job Details By Id ----- */


/* ----- View Job Details By Location ----- */
exports.getJobByLocation = async (req, res) => {
    try {

        var pattern = `^${req.body.location}`

        const findData = await Jobs.find({ location: { $regex: pattern, $options: 'i' } });

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "JOBS DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "JOBS VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("getJobByLocation::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End View Job Details By Location ----- */


/* ----- View Job Details By Technology ----- */
exports.getJobByTechnology = async (req, res) => {
    try {

        var pattern = `^${req.body.technology}`

        const findData = await Jobs.find({ technology: { $regex: pattern, $options: 'i' } });

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "JOBS DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "JOBS VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("getJobByTechnology::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End View Job Details By Technology ----- */


/* ----- View Job Details By Position ----- */
exports.getJobByPosition = async (req, res) => {
    try {

        var pattern = `^${req.body.position}`

        const findData = await Jobs.find({ position: { $regex: pattern, $options: 'i' } });

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "JOBS DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "JOBS VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("getJobByPosition::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End View Job Details By Position ----- */


/* ----- View Job Details By Company For company ----- */
exports.getJobByCompany = async (req, res) => {
    try {

        const findData = await Jobs.find({ company_id: req.user._id });

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "JOBS DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "JOBS VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("getJobByCompany::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End View Job Details By Company ----- */


/* ----- View Job Details By Company For Admin ----- */
exports.listJobByCompany = async (req, res) => {
    try {

        const findData = await Jobs.find({ company_id: req.params.company_id });

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "JOBS DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "JOBS VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("listJobByCompany::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End View Job Details By Company ----- */


/* ----- delete Job ----- */
exports.deleteJob = async (req, res) => {
    try {

        const findJobData = await Jobs.findOne({ _id: req.params.id });

        if (findJobData) {

            const deleteJob = await Jobs.deleteOne({ _id: req.params.id })
            const deleteApplies = await Applies.deleteMany({ work_id: req.params.id });
            const deleteHired = await Hired.deleteMany({ work_id: req.params.id });

            res.status(status.OK).json(
                {
                    message: "JOB DELETE SUCCESSFULLY !",
                    status: true,
                    code: 200
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "JOB DOES NOT FOUND!",
                    status: true,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("deleteJob::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End delete Job ----- */