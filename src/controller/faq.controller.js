const Faq = require("../model/faq.model")
const status = require('http-status');


/* ----- insert faq ----- */
exports.insertFAQ = async (req, res) => {
    try {

        const faqData = new Faq({
            question: req.body.question,
            answer: req.body.answer
        })
        const saveData = await faqData.save()

        res.status(status.CREATED).json(
            {
                message: "FREQUENTLY ASKED QUESTIONS INSERT SUCCESSFULLY !",
                status: true,
                code: 201,
                data: saveData
            }
        )

    } catch (error) {

        console.log("insertFAQ::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End insert faq ----- */


/* ----- update faq ----- */
exports.updateFAQ = async (req, res) => {
    try {

        const updateData = await Faq.findOneAndUpdate({ _id: req.params.id },
            {
                $set: {
                    question: req.body.question,
                    answer: req.body.answer
                }
            }).then(() => {

                res.status(status.OK).json(
                    {
                        message: "FREQUENTLY ASKED QUESTIONS UPDATE SUCCESSFULLY !",
                        status: true,
                        code: 200
                    }
                )

            })

    } catch (error) {

        console.log("updateFAQ::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End update faq ----- */


/* ----- view All FAQ ----- */
exports.viewAllFAQ = async (req, res) => {
    try {

        const faqData = await Faq.find({});

        if(faqData[0] == undefined){

            res.status(status.OK).json(
                {
                    message: "FREQUENTLY ASKED QUESTIONS DOES NOT EXIST!",
                    status: true,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "FREQUENTLY ASKED QUESTIONS VIEW SUCCESSFULLY!",
                    status: true,
                    code: 200,
                    data: faqData
                }
            )

        }
        
    } catch (error) {

        console.log("viewAllFAQ::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })
        
    }
}
/* ----- End view All FAQ ----- */


/* ----- getOneFAQ ----- */
exports.getOneFAQ = async (req, res) => {
    try {

        const faqData = await Faq.findOne({ _id : req.params.id })

        if(faqData) {

            const obj = {
                question: faqData.question,
                answer : faqData.answer
            }

            res.status(status.OK).json({
                message: "FREQUENTLY ASKED QUESTIONS VIEW SUCCESSFULLY",
                status: true,
                code: 200,
                data: obj
            })

        } else {

            res.status(status.OK).json({
                message: "FREQUENTLY ASKED QUESTIONS DOES NOT FOUND",
                status: false,
                code: 404
            })

        }
        
    } catch (error) {

        console.log("getOneFAQ::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })
        
    }
}
/* ----- End getOneFAQ ----- */


/* ----- delete FAQ ----- */
exports.deleteFAQ = async (req, res) => {
    try {

        const faqData = await Faq.findOne({ _id : req.params.id })

        if(faqData) {

            const faqData = await Faq.deleteOne({ _id : req.params.id })

            res.status(status.OK).json({
                message: "FREQUENTLY ASKED QUESTIONS DELETE SUCCESSFULLY",
                status: true,
                code: 200
            })

        } else {

            res.status(status.OK).json({
                message: "FREQUENTLY ASKED QUESTIONS DOES NOT FOUND",
                status: false,
                code: 404
            })

        }
        
    } catch (error) {

        console.log("deleteFAQ::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })
        
    }
}
/* ----- End getOneFAQ ----- */