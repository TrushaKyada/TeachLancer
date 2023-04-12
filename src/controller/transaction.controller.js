const Transaction = require("../model/transaction.model");
const User = require("../model/user.model");
const Teacher = require("../model/teacher.model");
const Courses = require("../model/courses.model");
const status = require('http-status');
const stripe = require('stripe')('sk_test_51MiZn5SHU44Sm99DkkTejHy5BuSxWnTIV2UM5la2hREYmIc27gCBVsIITkPH31h5yN0icS8ISZB8WaPQskJMDz6D00U9DKu2Qz');


/* ----- Create Charge ----- */
exports.createCharge = async (req, res) => {
    try {

        const customer = await stripe.customers.create({
            name: req.body.username,
            email: req.body.email
        });
        console.log("customer:", req.body);

        const paymentMethod = await stripe.paymentMethods.create(
            {
                type: 'card',
                card: {
                    number: `${req.body.cardNumber}`,
                    exp_month: parseInt(req.body.exMonth),
                    exp_year: parseInt(req.body.exYear),
                    cvc: `${req.body.cvc}`
                },
            }
        );
        console.log("paymentMethod:", paymentMethod);

        const paymentIntent = await stripe.paymentIntents.create({
            payment_method_types: ['card'],
            description: req.body.description,
            amount: parseInt(req.body.amount) * 100,
            currency: "inr",
            customer: `${customer.id}`,
            payment_method: `${paymentMethod.id}`,
            off_session: true,
            confirm: true,
        }).then(async (resp) => {

            const transactionDetails = new Transaction({
                user_id: req.params.user_id,
                course_id: req.params.course_id,
                price: req.body.price,
                type: req.body.type,
                description: req.body.description,
                status: req.body.status
            })
            const saveData = await transactionDetails.save();

            res.status(status.OK).json({
                message: "PAYMENT SUCCESSFULLY DONE",
                status: true,
                code: 200,
                data: {
                    paymentId: resp.id,
                    amount: parseInt(resp.amount) / 100,
                    email: customer.email
                }
            })
        }).catch((err) => {

            res.status(status.OK).json({
                message: "Error",
                status: false,
                code: 500,
                data: err.message
            })

        })

    } catch (error) {

        console.log("createCharge::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Create Charge ----- */


/* ----- pay salary ----- */
exports.paySalary = async (req, res) => {
    try {

        const findTeacher = await Teacher.findOne({ _id: req.params.teacher_id })

        if (findTeacher) {

            const customer = await stripe.customers.create({
                name: req.body.username,
                email: req.body.email
            });
            console.log("customer:", req.body);

            const paymentMethod = await stripe.paymentMethods.create(
                {
                    type: 'card',
                    card: {
                        number: `${req.body.cardNumber}`,
                        exp_month: parseInt(req.body.exMonth),
                        exp_year: parseInt(req.body.exYear),
                        cvc: `${req.body.cvc}`
                    },
                }
            );
            console.log("paymentMethod:", paymentMethod);

            const paymentIntent = await stripe.paymentIntents.create({
                payment_method_types: ['card'],
                description: req.body.description,
                amount: parseInt(req.body.amount) * 100,
                currency: "inr",
                customer: `${customer.id}`,
                payment_method: `${paymentMethod.id}`,
                off_session: true,
                confirm: true,
            }).then(async (resp) => {

                const transactionDetails = new Transaction({
                    user_id: req.params.teacher_id,
                    amount: req.body.amount,
                    type: 1,
                    description: req.body.description,
                    status: req.body.status
                })
                const saveData = await transactionDetails.save();

                res.status(status.OK).json({
                    message: "PAYMENT SUCCESSFULLY DONE",
                    status: true,
                    code: 200,
                    data: {
                        paymentId: resp.id,
                        amount: parseInt(resp.amount) / 100,
                        email: customer.email
                    }
                })
            }).catch((err) => {

                res.status(status.OK).json({
                    message: "Error",
                    status: false,
                    code: 500,
                    data: err.message
                })

            })

        } else {

            res.status(status.OK).json(
                {
                    message: "TEACHER NOT EXIST!",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("createCharge::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End pay salary ----- */


/* ----- pay Fees ----- */
exports.payFees = async (req, res) => {
    try {

        const findUser = await User.findOne({ _id: req.params.user_id })

        if (findUser) {

            const findCourse = await Courses.findOne({ _id: req.params.course_id })

            if (findCourse) {

                const customer = await stripe.customers.create({
                    name: req.body.username,
                    email: req.body.email
                });
                console.log("customer:", req.body);

                const paymentMethod = await stripe.paymentMethods.create(
                    {
                        type: 'card',
                        card: {
                            number: `${req.body.cardNumber}`,
                            exp_month: parseInt(req.body.exMonth),
                            exp_year: parseInt(req.body.exYear),
                            cvc: `${req.body.cvc}`
                        },
                    }
                );
                console.log("paymentMethod:", paymentMethod);

                const paymentIntent = await stripe.paymentIntents.create({
                    payment_method_types: ['card'],
                    description: req.body.description,
                    amount: parseInt(req.body.amount) * 100,
                    currency: "inr",
                    customer: `${customer.id}`,
                    payment_method: `${paymentMethod.id}`,
                    off_session: true,
                    confirm: true,
                }).then(async (resp) => {

                    const transactionDetails = new Transaction({
                        user_id: req.params.user_id,
                        course_id: req.params.course_id,
                        amount: req.body.amount,
                        type: 2,
                        description: req.body.description,
                        status: req.body.status
                    })
                    const saveData = await transactionDetails.save();

                    res.status(status.OK).json({
                        message: "PAYMENT SUCCESSFULLY DONE",
                        status: true,
                        code: 200,
                        data: {
                            paymentId: resp.id,
                            amount: parseInt(resp.amount) / 100,
                            email: customer.email
                        }
                    })
                }).catch((err) => {

                    res.status(status.OK).json({
                        message: "Error",
                        status: false,
                        code: 500,
                        data: err.message
                    })

                })

            } else {

                res.status(status.OK).json(
                    {
                        message: "COURSE NOT EXIST!",
                        status: false,
                        code: 404
                    }
                )

            }

        } else {

            res.status(status.OK).json(
                {
                    message: "USER NOT EXIST!",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("createCharge::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End pay Fees ----- */


/* ----- view All Transaction ----- */
exports.viewAllTransaction = async (req, res) => {
    try {

        const getTansactionData = await Transaction.find({});

        if (getTansactionData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "NOT A SINGLE TRANSACTION AVAILABLE!",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "TRANSACTION VIEW SUCCESSFULLY!",
                    status: true,
                    code: 200,
                    data: getTansactionData
                }
            )

        }

    } catch (error) {

        console.log("viewAllTransaction::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End view All Transaction ----- */


/* ----- view Transaction By User Id ----- */
exports.viewTransactionByUserId = async (req, res) => {
    try {

        const user = req.user

        const getTansactionData = await Transaction.find({ user_id: user._id });

        if (getTansactionData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "TRANSACTION NOT EXIST!",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "TRANSACTION VIEW SUCCESSFULLY!",
                    status: true,
                    code: 200,
                    data: getTansactionData
                }
            )

        }

    } catch (error) {

        console.log("viewTransactionByUserId::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End view Transaction By User Id ----- */


/* ----- view Transaction By Teacher Id ----- */
exports.viewTransactionByTeacherId = async (req, res) => {
    try {

        const teacher = req.user

        const getTansactionData = await Transaction.find({ user_id: teacher._id });

        if (getTansactionData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "TRANSACTION NOT EXIST!",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "TRANSACTION VIEW SUCCESSFULLY!",
                    status: true,
                    code: 200,
                    data: getTansactionData
                }
            )

        }

    } catch (error) {

        console.log("viewTransactionByTeacherId::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End view Transaction By Teacher Id ----- */


/* ----- view Transaction By Type for admin ----- */
exports.viewTransactionByType = async (req, res) => {
    try {

        const type = req.params.type
        console.log("type", type);

        if (type == 2) {

            const findSalaryTransaction = await Transaction.find({ type: 2 })

            if (findSalaryTransaction[0] == undefined) {

                res.status(status.OK).json(
                    {
                        message: "TRANSACTION NOT EXIST!",
                        status: false,
                        code: 404
                    }
                )

            } else {

                const data = []
                for (const findUserName of findSalaryTransaction) {

                    const findUserData = await User.findOne({ _id: findUserName.user_id })
                    const findCourseData = await Courses.findOne({ _id: findUserName.course_id })

                    const userName = `${findUserData.first_name} ${findUserData.last_name ? findUserData.last_name : ''}`;
                    const response = {
                        _id: findUserName._id,
                        user_name: userName.trim(),
                        mobile_no: findUserData.mobile,
                        course_id: findCourseData.title,
                        price: findUserName.price,
                        type: findUserName.type,
                        description: findUserName.description,
                        status: findUserName.status
                    }
                    data.push(response)
                }

                res.status(status.OK).json(
                    {
                        message: "TRANSACTION VIEW SUCCESSFULLY!",
                        status: true,
                        code: 200,
                        data: data
                    }
                )

            }

        } else {

            const findFeesTransaction = await Transaction.find({ type: 1 })

            if (findFeesTransaction[0] == undefined) {

                res.status(status.OK).json(
                    {
                        message: "TRANSACTION NOT EXIST!",
                        status: false,
                        code: 404
                    }
                )

            } else {

                const data = []
                for (const findUserName of findFeesTransaction) {
                    // console.log("findUserName", findUserName);

                    const findUserData = await Teacher.findOne({ _id: findUserName.user_id })

                    const userName = `${findUserData.first_name} ${findUserData.last_name ? findUserData.last_name : ''}`;
                    const response = {
                        _id: findUserName._id,
                        user_name: userName.trim(),
                        mobile_no: findUserData.mobile,
                        price: findUserName.price,
                        type: findUserName.type,
                        description: findUserName.description,
                        amount: findUserName.amount,
                        status: findUserName.status
                    }
                    data.push(response)
                }

                res.status(status.OK).json(
                    {
                        message: "TRANSACTION VIEW SUCCESSFULLY!",
                        status: true,
                        code: 200,
                        data: data
                    }
                )

            }

        }

    } catch (error) {

        console.log("viewTransactionByType::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End view Transaction By Type for admin ----- */