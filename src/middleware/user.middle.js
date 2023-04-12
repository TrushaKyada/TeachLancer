const userModel = require("../model/user.model");
const status = require('http-status');
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.verifyUser = async (req, res, next) => {

    const Token = req.headers['authorization'];

    if (Token === undefined) {

        res.status(status.OK).json(
            {
                message: "NOT GET TOKEN!",
                status: false,
                code: 403
            }
        )

    } else {

        const decoded = jwt.verify(Token, process.env.SECRET_KEY, async (err, playload) => {
            if (err == 'JsonWebTokenError: jwt malformed') {

                res.status(status.OK).json(
                    {
                        message: "NOT GET TOKEN!",
                        status: false,
                        code: 403
                    }
                )

            } else {
                // console.log("playload", playload);
                const data = await userModel.findById({ _id: playload._id })

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
                            message: "USER DOES NOT FOUND!",
                            status: false,
                            code: 404
                        }
                    )

                }
            }
        });
    }
}