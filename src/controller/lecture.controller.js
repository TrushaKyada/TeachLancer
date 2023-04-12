const Lecture = require("../model/lecture.model");
const Courses = require("../model/courses.model");
const Enrolled = require("../model/enrolled.model");
const User = require("../model/user.model");
const status = require('http-status');
const bcrypt = require("bcrypt");


/* ----- Lecture Insert ----- */
exports.insertLecture = async (req, res) => {
    try {

        let day = req.body.day;
        const myArray = day.split(",");

        const trimArray = myArray.map(element => {
            return element.trim();
        });

        // generate 6 digite code
        var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var passwordLength = 5;
        var code = "";
        for (var i = 0; i <= passwordLength; i++) {
            var randomNumber = Math.floor(Math.random() * chars.length);
            code += chars.substring(randomNumber, randomNumber + 1);
        }
        console.log("code", code);

        const findCourseData = await Lecture.find({ course_id: req.body.course_id }).count();
        const findCourseName = await Courses.findOne({ _id: req.body.course_id });

        if (findCourseName) {

            if (findCourseData <= 2) {

                const lectureDetails = new Lecture({
                    course_id: req.body.course_id,
                    course_name: findCourseName.title,
                    start_date: req.body.start_date,
                    end_date: req.body.end_date,
                    day: trimArray,
                    start_time: req.body.start_time,
                    end_time: req.body.end_time,
                    timezone: req.body.timezone,
                    slot: req.body.slot,
                    code: code
                })
                const saveData = await lectureDetails.save();

                res.status(status.CREATED).json(
                    {
                        message: "LECTURE INSERT SUCCESSFULLY !",
                        status: true,
                        code: 201,
                        data: saveData
                    }
                )

            } else {

                res.status(status.OK).json(
                    {
                        message: "THERE ARE ALREADY 3 LECTURES INSERTED FOR THIS COURSE SO YOU CANNOT INSERT LECTURE FOR THIS COURSE !",
                        status: false,
                        code: 406
                    }
                )

            }

        } else {

            res.status(status.OK).json(
                {
                    message: "COURSE DOES NOT EXIST!",
                    status: false,
                    code: 200
                }
            )

        }

    } catch (error) {

        console.log("insertLecture::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Lecture Insert ----- */


/* ----- Lecture Update ----- */
exports.updateLecture = async (req, res) => {
    try {

        const findData = await Lecture.findOne({ _id: req.params.id })

        if (findData) {

            let day = req.body.day;

            if (Array.isArray(day) == true) {

                const updateData = await Lecture.findOneAndUpdate({ _id: req.params.id },
                    {
                        $set: {
                            course_id: req.body.course_id,
                            start_date: req.body.start_date,
                            end_date: req.body.end_date,
                            day: req.body.day,
                            start_time: req.body.start_time,
                            end_time: req.body.end_time,
                            timezone: req.body.timezone,
                            slot: req.body.slot
                        }
                    }).then(() => {

                        res.status(status.OK).json(
                            {
                                message: "LECTURE UPDATED SUCCESSFULLY !",
                                status: true,
                                code: 200
                            }
                        )

                    })

            } else {

                const myArray = day.split(",");
                const trimArray = myArray.map(element => {
                    return element.trim();
                });

                const updateData = await Lecture.findOneAndUpdate({ _id: req.params.id },
                    {
                        $set: {
                            course_id: req.body.course_id,
                            start_date: req.body.start_date,
                            end_date: req.body.end_date,
                            day: trimArray,
                            start_time: req.body.start_time,
                            end_time: req.body.end_time,
                            timezone: req.body.timezone,
                            slot: req.body.slot
                        }
                    }).then(() => {

                        res.status(status.OK).json(
                            {
                                message: "LECTURE UPDATED SUCCESSFULLY !",
                                status: true,
                                code: 200
                            }
                        )

                    })

            }

        } else {

            res.status(status.OK).json(
                {
                    message: "LECTURE NOT FOUND!",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("updateLecture::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Lecture Update ----- */


/* ----- View All Lecture ----- */
exports.viewAllLecture = async (req, res) => {
    try {

        const findData = await Lecture.find({})

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "LECTURE NOT EXIST!",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "LECTURE VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("viewAllLecture::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End View All Lecture ----- */


/* ----- View part time Lecture By Course Id ----- */
exports.viewPartTimeLecture = async (req, res) => {
    try {

        const findData = await Lecture.find({ course_id: req.params.course_id, type: 1 })

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "LECTURE NOT EXIST!",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "LECTURE VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("viewPartTimeLecture::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End View All Lecture By Course Id ----- */


/* ----- View Full time Lecture By Course Id ----- */
exports.viewFullTimeLecture = async (req, res) => {
    try {

        const findData = await Lecture.find({ course_id: req.params.course_id, type: 2 })

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "LECTURE NOT EXIST!",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "LECTURE VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("viewFullTimeLecture::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End View All Lecture By Course Id ----- */


/* ----- Slot Update ----- */
exports.updateSlot = async (req, res) => {
    try {

        const findData = await Lecture.findOne({ _id: req.params.id })

        if (findData) {

            const updateData = await Lecture.findOneAndUpdate({ _id: req.params.id },
                {
                    $set: {
                        slot: req.body.slot
                    }
                }).then(() => {

                    res.status(status.OK).json(
                        {
                            message: "LECTURE SLOT UPDATED SUCCESSFULLY !",
                            status: true,
                            code: 200
                        }
                    )

                })

        } else {

            res.status(status.OK).json(
                {
                    message: "LECTURE NOT FOUND!",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("updateSlot::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Slot Update ----- */


/* ----- View Lecture By Id ----- */
exports.viewLectureById = async (req, res) => {
    try {

        const findData = await Lecture.find({ _id: req.params.id })

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "LECTURE NOT EXIST!",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "LECTURE VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("viewLectureById::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Lecture By Id ----- */


/* ----- View Lecture By Course Id ----- */
exports.viewLectureByCourseId = async (req, res) => {
    try {

        const findData = await Lecture.find({ course_id: req.params.course_id })

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "LECTURE NOT EXIST!",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "LECTURE VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("viewLectureByCourseId::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Lecture By Course Id ----- */


/* ----- Delete Lecture ----- */
exports.deleteLecture = async (req, res) => {
    try {

        const adminId = req.user;

        bcrypt.compare(req.body.password, adminId.password, async (err, comparePassword) => {

            if (comparePassword) {

                const findData = await Lecture.findOne({ _id: req.params.id })
                console.log("findData", findData);

                if (findData) {

                    const deleteLecture = await Lecture.deleteOne({ _id: req.params.id });
                    const deleteEnrolled = await Enrolled.deleteMany({ code: findData.code })

                    res.status(status.OK).json(
                        {
                            message: "LECTURE DELETE SUCCESSFULLY !",
                            status: true,
                            code: 200
                        }
                    )

                } else {

                    res.status(status.OK).json(
                        {
                            message: "LECTURE NOT EXIST!",
                            status: false,
                            code: 404
                        }
                    )

                }

            } else {

                res.status(status.OK).json(
                    {
                        message: "INVALID CREDENCIAL !",
                        status: false,
                        code: 401
                    }
                )

            }

        })

    } catch (error) {

        console.log("deleteLecture::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Delete Lecture ----- */
