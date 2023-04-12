const Carrer = require("../model/career.model");
const User = require("../model/user.model")
const bcrypt = require("bcrypt");
const status = require('http-status');


/* ----- Insert Carrer Details ----- */
exports.insertCarrerDetails = async (req, res) => {
    try {

        id = req.user._id;

        const userData = await User.findOne({ _id: id });

        if (userData) {

            const careerDetails = new Carrer({
                user_id: id,
                company_name: req.body.company_name,
                company_bio: req.body.company_bio,
                com_start_date: req.body.com_start_date,
                com_end_date: req.body.com_end_date,
                position: req.body.position,
                your_role: req.body.your_role,
                project_name: req.body.project_name,
                project_description: req.body.project_description,
                pro_start_date: req.body.pro_start_date,
                pro_end_date: req.body.pro_end_date,
                member: req.body.member
            })
            const saveData = await careerDetails.save()

            res.status(status.CREATED).json(
                {
                    message: "CAREER DETAILS INSERT SUCCESSFULLY !",
                    status: true,
                    code: 201,
                    data: saveData
                }
            )

        }

        else {

            res.status(status.OK).json(
                {
                    message: "USER DOES NOT FOUND !",
                    status: false,
                    code: 404
                }
            )

        }
    } catch (error) {

        console.log("insertCarrerDetails::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Insert Carrer Details ----- */


/* ----- Update Carrer Details ----- */
exports.updateCarrerDetails = async (req, res) => {
    try {

        id = req.user._id;

        const userData = await User.findOne({ _id: id });
      
        if (userData) {

            const updateData = await Carrer.findOneAndUpdate({ user_id: id },
                {
                    $set: {
                        user_id: id,
                        company_name: req.body.company_name,
                        company_bio: req.body.company_bio,
                        com_start_date: req.body.com_start_date,
                        com_end_date: req.body.com_end_date,
                        position: req.body.position,
                        your_role: req.body.your_role,
                        project_name: req.body.project_name,
                        project_description: req.body.project_description,
                        pro_start_date: req.body.pro_start_date,
                        pro_end_date: req.body.pro_end_date,
                        member: req.body.member
                    }
                }).then(() => {

                    res.status(status.OK).json(
                        {
                            message: "CAREER DETAILS UPDATED SUCCESSFULLY !",
                            status: true,
                            code: 200
                        }
                    )

                }).catch((error) => {
                    console.log("error", error);
                })

        } else {

            res.status(status.OK).json(
                {
                    message: "USER DOES NOT FOUND !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("updateCarrerDetails::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Update Carrer Details ----- */


/* ----- View Career Details ----- */
exports.viewCareerDetails = async (req, res) => {
    try {

        const careerData = await Carrer.find({});

        if(careerData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "CAREER DETAILS NOT EXIST !",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "COMPANY DETAILS VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: careerData
                }
            )

        }

    } catch (error) {

        console.log("viewCareerDetails::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End View Career Details ----- */


/* ----- View Career Details By Id ----- */
exports.viewCareerDetailsById = async (req, res) => {
    try {

        const findData = await Carrer.find({ _id: req.params.id })

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "CAREER DETAILS NOT EXIST!",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "CAREER DETAILS VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("viewCareerDetailsById::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Career Details By Id ----- */


/* ----- View Career Details By User Id ----- */
exports.viewCareerDetailsByUserId = async (req, res) => {
    try {

        const findData = await Carrer.find({ user_id: req.params.user_id })

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "CAREER DETAILS NOT EXIST!",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "CAREER DETAILS VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("viewCareerDetailsByUserId::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Career Details By User Id ----- */