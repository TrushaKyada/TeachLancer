const Admin = require("../model/admin.model");
const status = require('http-status');
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.verifyAdmin = async (req, res, next) => {

    const Token = req.headers['authorization'];

    if (Token) {

        const decoded = jwt.verify(Token, process.env.SECRET_KEY);
        const data = await Admin.findById({ _id: decoded._id })

        if (data) {
            req.user = data

            if (Token == data.token) {
                next();
            }
            else {
                res.status(status.OK).json(
                    {
                        message: "UNAUTHORIZED!",
                        status: false,
                        code: 401
                    }
                )
            }
        }
        else {
            res.status(status.OK).json(
                {
                    message: "ADMIN DOES NOT FOUND!",
                    status: false,
                    code: 404
                }
            )
        }

    }
    else {
        res.status(status.OK).json(
            {
                message: "NOT GET TOKEN!",
                status: false,
                code: 403
            }
        )
    }
}