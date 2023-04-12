const Contact = require("../model/contact.model");
const status = require('http-status');


/* ----- Insert Contact ----- */
exports.insertContact = async (req, res) => {
    try {

        const addContactData = new Contact({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            message: req.body.message
        })
        const saveData = await addContactData.save();

        res.status(status.CREATED).json(
            {
                message: "CONTACT DATA INSERT SUCCESSFULLY !",
                status: true,
                code: 201,
                data: saveData
            }
        )

    } catch (error) {

        console.log("createGroup::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Insert Contact ----- */
