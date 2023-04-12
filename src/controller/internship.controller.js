const Internship = require("../model/internship.model")
const Applies = require("../model/applies.model");
const Hired = require("../model/hired.model")
const status = require('http-status');
const bcrypt = require("bcrypt");


/* ----- Post Internship ----- */
exports.postInternship = async (req, res) => {
    try {

        const company = req.user;
        console.log("company", company);

        let skills = req.body.skills
        const myArray = skills.split(",");

        const trimArray = myArray.map(element => {
            return element.trim();
        });

        const internshipDetails = new Internship({
            company_id: company._id,
            company_name: company.name,
            type: req.body.type,
            time: req.body.time,
            address: `${company.city}, ${company.state}, ${company.country}`,
            vacancy: req.body.vacancy,
            start_date: req.body.start_date,
            duration: req.body.duration,
            description: req.body.description,
            technology: req.body.technology,
            stipend: req.body.stipend,
            stipend_salary: req.body.stipend_salary,
            perks: req.body.perks,
            skills: trimArray,
            active: req.body.active
        })
        const saveData = await internshipDetails.save();

        res.status(status.CREATED).json(
            {
                message: "INTERNSHIP POST SUCCESSFULLY !",
                status: true,
                code: 201,
                data: saveData
            }
        )

    } catch (error) {

        console.log("postInternship::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Internship Job ----- */


/* ----- Update Internship Details ----- */
exports.updateInternship = async (req, res) => {
    try {

        const company = req.user;

        const internshipData = await Internship.findOne({ _id: req.params.id });

        if (internshipData) {

            const token_company_id = (company._id).toString()
            const internship_company_id = (internshipData.company_id).toString()

            if (token_company_id == internship_company_id) {

                let skills = req.body.skills;

                if (Array.isArray(skills) == true) {

                    const updateData = await Internship.findOneAndUpdate({ _id: req.params.id },
                        {
                            $set: {
                                company_id: company._id,
                                company_name: company.name,
                                type: req.body.type,
                                time: req.body.time,
                                address: `${company.city}, ${company.state}, ${company.country}`,
                                vacancy: req.body.vacancy,
                                start_date: req.body.start_date,
                                duration: req.body.duration,
                                description: req.body.description,
                                technology: req.body.technology,
                                stipend: req.body.stipend,
                                stipend_salary: req.body.stipend_salary,
                                perks: req.body.perks,
                                skills: req.body.skills,
                                active: req.body.active
                            }
                        }).then(() => {

                            res.status(status.OK).json(
                                {
                                    message: "INTERNSHIP UPDATED SUCCESSFULLY !",
                                    status: true,
                                    code: 200
                                }
                            )

                        })

                } else {

                    const myArray = skills.split(",");

                    const updateData = await Internship.findOneAndUpdate({ _id: req.params.id },
                        {
                            $set: {
                                company_id: company._id,
                                company_name: company.name,
                                type: req.body.type,
                                time: req.body.time,
                                address: `${company.city}, ${company.state}, ${company.country}`,
                                vacancy: req.body.vacancy,
                                start_date: req.body.start_date,
                                duration: req.body.duration,
                                description: req.body.description,
                                technology: req.body.technology,
                                stipend: req.body.stipend,
                                stipend_salary: req.body.stipend_salary,
                                perks: req.body.perks,
                                skills: myArray,
                                active: req.body.active
                            }
                        }).then(() => {

                            res.status(status.OK).json(
                                {
                                    message: "INTERNSHIP UPDATED SUCCESSFULLY !",
                                    status: true,
                                    code: 200
                                }
                            )

                        })

                }

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
                    message: "INTERNSHIP DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("updateInternship::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Update Internship Details ----- */


/* ----- All Internship List ----- */
exports.allInternshipList = async (req, res) => {
    try {

        const findData = await Internship.find({});

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "INTERNSHIP DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "INTERNSHIP VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("allInternshipList::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End All Internship List ----- */


/* ----- View Internship Details By Id ----- */
exports.viewInternshipDetails = async (req, res) => {
    try {

        const findData = await Internship.findOne({ _id: req.params.id });

        if (findData) {

            res.status(status.OK).json(
                {
                    message: "INTERNSHIP VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "INTERNSHIP DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("viewInternshipDetails::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End View Internship Details By Id ----- */


/* ----- View Internship Details By Location ----- */
exports.getInternshipByLocation = async (req, res) => {
    try {

        var pattern = `^${req.body.city}`

        const findData = await Internship.find({ city: { $regex: pattern, $options: 'i' } });

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "INTERNSHIP DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "INTERNSHIP VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("getInternshipByLocation::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End View Internship Details By Location ----- */


/* ----- View Internship Details By Technology ----- */
exports.getInternshipByTechnology = async (req, res) => {
    try {

        var pattern = `^${req.body.technology}`

        const findData = await Internship.find({ technology: { $regex: pattern, $options: 'i' } });

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "INTERNSHIP DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "INTERNSHIP VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("getInternshipByTechnology::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End View Internship Details By Technology ----- */


/* ----- View Internship Details By Company ----- */
exports.getInternshipByCompany = async (req, res) => {
    try {

        const findData = await Internship.find({ company_id: req.user._id });

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "INTERNSHIP DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "INTERNSHIP VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("getInternshipByCompany::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End View Internship Details By Company ----- */


/* ----- View Internship Details By Company For Admin ----- */
exports.listInternshipByCompany = async (req, res) => {
    try {

        const findData = await Internship.find({ company_id: req.params.company_id });

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "INTERNSHIP DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "INTERNSHIP VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("listInternshipByCompany::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End View Internship Details By Company For Admin ----- */


/* ----- delete Internship ----- */
exports.deleteInternship = async (req, res) => {
    try {

        const findInternshipData = await Internship.findOne({ _id: req.params.id });

        if (findInternshipData) {

            const deleteInternship = await Internship.deleteOne({ _id: req.params.id });
            const deleteApplies = await Applies.deleteMany({ work_id: req.params.id });
            const deleteHired = await Hired.deleteMany({ work_id: req.params.id });

            res.status(status.OK).json(
                {
                    message: "INTERNSHIP DELETE SUCCESSFULLY !",
                    status: true,
                    code: 200
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "INTERNSHIP DOES NOT FOUND!",
                    status: true,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("deleteInternship::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End delete Internship ----- */