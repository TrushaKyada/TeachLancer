const Hired = require("../model/hired.model")
const Applies = require("../model/applies.model");
const Jobs = require("../model/jobs.model")
const status = require('http-status');
const { sendEmail } = require("../helper/mail.services");


/* ----- hire User ----- */
exports.hireUser = async (req, res) => {
    try {

        const appliesData = await Applies.findOne({ _id: req.params.applies_id })

        if (appliesData) {

            const company_id = req.user._id;

            if ((company_id).toString() == (appliesData.company_id).toString()) {

                const positionData = await Jobs.findOne({ _id: appliesData.work_id })

                if (positionData) {

                    const hiredData = new Hired({
                        user_id: appliesData.user_id,
                        company_id: company_id,
                        work_id: appliesData.work_id,
                        applies_id: req.params.applies_id,
                        username: appliesData.username,
                        compnay_name: appliesData.company_name,
                        position: positionData.position
                    })
                    const saveData = await hiredData.save()

                    const updateAppiesData = await Applies.findOneAndUpdate({ _id: req.params.applies_id }, {
                        $set: {
                            status: 3
                        }
                    })

                    // mail content
                    let subject = "For Infom To Hired";
                    let content = { "userName": saveData.username, "companyName" : saveData.compnay_name };
                    let filePath = '/home/kurm/web Design/All Work/node js/teachLancer/views/hiredMail.ejs'

                    await sendEmail(appliesData.user_email, subject, content, filePath)

                    res.status(status.CREATED).json(
                        {
                            message: "HIRED USER DETAILS INSERT SUCCESSFULLY !",
                            status: true,
                            code: 201,
                            data: saveData
                        }
                    )

                } else {

                    const hiredData = new Hired({
                        user_id: appliesData.user_id,
                        company_id: company_id,
                        work_id: appliesData.work_id,
                        applies_id: req.params.applies_id,
                        username: appliesData.username,
                        compnay_name: appliesData.company_name
                    })
                    const saveData = await hiredData.save();

                    const updateAppiesData = await Applies.findOneAndUpdate({ _id: req.params.applies_id }, {
                        $set: {
                            status: 3
                        }
                    })

                    // mail content
                    let subject = "For Infom To Hired";
                    let content = { "userName": saveData.username, "companyName" : saveData.compnay_name };
                    let filePath = '/home/kurm/web Design/All Work/node js/teachLancer/views/hiredMail.ejs'

                    await sendEmail(appliesData.user_email, subject, content, filePath)

                    res.status(status.CREATED).json(
                        {
                            message: "HIRED USER DETAILS INSERT SUCCESSFULLY !",
                            status: true,
                            code: 201,
                            data: saveData
                        }
                    )

                }

            } else {

                res.status(status.OK).json(
                    {
                        message: "COMPANY WISE APPLIES DETAILS NOT EXIST !",
                        status: false,
                        code: 404
                    }
                )

            }

        } else {

            res.status(status.OK).json(
                {
                    message: "APPLIES DETAILS NOT EXIST !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("hireUser::error", error);
        console.log("error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End hire User ----- */


/* ----- get Hired User By Compnay ----- */
exports.getHiredUserByCompnay = async (req, res) => {
    try {

        const company_id = req.user._id;

        const companyWiseData = await Hired.find({ company_id: company_id });

        if (companyWiseData[0] == undefined) {

            res.status(status.OK).json({
                message: "HIRED USER NOT EXIST",
                status: false,
                code: 400
            })

        } else {

            res.status(status.OK).json(
                {
                    message: "HIRED USER DETAILS VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: companyWiseData
                }
            )

        }

    } catch (error) {

        console.log("getHiredUserByCompnay::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End get Hired User By Compnay ----- */