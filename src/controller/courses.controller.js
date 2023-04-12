const Courses = require("../model/courses.model");
const Teacher = require("../model/teacher.model");
const Lecture = require("../model/lecture.model");
const Enrolled = require("../model/enrolled.model");
const status = require('http-status');
const cloudinary = require("../util/cloudinary.util");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");


/* ----- Add Courses ----- */
exports.addCourse = async (req, res) => {
    try {

        let skill = req.body.skill;
        const myArray = skill.split(",");

        let unique_code = req.body.unique_code;
        const findTeacherData = await Teacher.findOne({ unique_code: unique_code });
        console.log("findTeacherData", findTeacherData);
        const checkTeacherData = await Courses.findOne({ unique_code: unique_code });
        console.log("checkTeacherData", checkTeacherData);

        if (checkTeacherData) {

            res.status(status.OK).json(
                {
                    message: "THIS TEACHER IS ALREADY ADDED TO THE COURSE SO YOU ADD ANOTHER TEACHER!",
                    status: false,
                    code: 406
                }
            )

        } else {

            if (myArray.length <= 6) {

                const obj = {
                    qualification: req.body.qualification,
                    id_proof: req.body.id_proof,
                    age: req.body.age,
                    communication: req.body.communication,
                    hardware: req.body.hardware,
                }

                const coursesDetails = new Courses({
                    unique_code: unique_code,
                    teacher_name: `${findTeacherData.first_name} ${findTeacherData.last_name}`,
                    title: req.body.title,
                    description: req.body.description,
                    skill: myArray,
                    term: req.body.term,
                    criteria: obj,
                    fees: req.body.fees,
                    candidate: req.body.candidate
                })
                const saveData = await coursesDetails.save()

                res.status(status.CREATED).json(
                    {
                        message: "COURSES REGISTRATION SUCCESSFULLY !",
                        status: true,
                        code: 201,
                        data: saveData
                    }
                )

            } else {

                res.status(status.OK).json(
                    {
                        message: "MUST BE INSERT MAXIMUM 6 SKILLS!",
                        status: false,
                        code: 406
                    }
                )

            }

        }

    } catch (error) {

        console.log("addCourse::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Add Courses ----- */


/* ----- Update Courses ----- */
exports.updateCourse = async (req, res) => {
    try {

        const coursesData = await Courses.findOne({ _id: req.params.id });

        if (coursesData) {

            let skill = req.body.skill;

            if (Array.isArray(skill) == true) {

                const updateData = await Courses.findOneAndUpdate({ _id: req.params.id, "criteria._id": coursesData.criteria[0]._id },
                    {
                        $set: {
                            teacher_id: req.body.teacher_id,
                            title: req.body.title,
                            description: req.body.description,
                            skill: skill,
                            term: req.body.term,
                            "criteria.$.qualification": req.body.qualification,
                            "criteria.$.id_proof": req.body.id_proof,
                            "criteria.$.age": req.body.age,
                            "criteria.$.communication": req.body.communication,
                            "criteria.$.hardware": req.body.hardware,
                            fees: req.body.fees,
                            candidate: req.body.candidate
                        }
                    }).then(() => {

                        res.status(status.OK).json(
                            {
                                message: "COURSES DETAILS UPDATED SUCCESSFULLY !",
                                status: true,
                                code: 200
                            }
                        )

                    })

            } else {

                const myArray = skill.split(",");

                if (myArray.length <= 6) {

                    const updateData = await Courses.findOneAndUpdate({ _id: req.params.id, "criteria._id": coursesData.criteria[0]._id },
                        {
                            $set: {
                                teacher_id: req.body.teacher_id,
                                title: req.body.title,
                                description: req.body.description,
                                skill: myArray,
                                term: req.body.term,
                                "criteria.$.qualification": req.body.qualification,
                                "criteria.$.id_proof": req.body.id_proof,
                                "criteria.$.age": req.body.age,
                                "criteria.$.communication": req.body.communication,
                                "criteria.$.hardware": req.body.hardware,
                                fees: req.body.fees,
                                candidate: req.body.candidate
                            }
                        }).then(() => {

                            res.status(status.OK).json(
                                {
                                    message: "COURSES DETAILS UPDATED SUCCESSFULLY !",
                                    status: true,
                                    code: 200
                                }
                            )

                        })

                } else {

                    res.status(status.OK).json(
                        {
                            message: "MUST BE INSERT MAXIMUM 6 SKILLS!",
                            status: false,
                            code: 406
                        }
                    )

                }

            }

        } else {

            res.status(status.OK).json(
                {
                    message: "COURSE DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("updateCourse::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Update Courses ----- */


/* ----- Courses Data View By Id ----- */
exports.getCourseData = async (req, res) => {
    try {

        const coursesData = await Courses.findOne({ _id: req.params.id });

        if (coursesData) {

            const findTeacherData = await Teacher.findOne({ unique_code: coursesData.unique_code })

            const response = {
                _id: coursesData._id,
                unique_code: coursesData.unique_code,
                teacher_profile: findTeacherData.profile,
                teacher_name: coursesData.teacher_name,
                title: coursesData.title,
                description: coursesData.description,
                skill: coursesData.skill,
                term: coursesData.term,
                criteria: coursesData.criteria,
                fees: coursesData.fees,
                candidate: coursesData.candidate
            }

            res.status(status.OK).json(
                {
                    message: "COURSES PROFILE VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: response
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "COURSES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("getCourseData::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Courses Data View By Id ----- */


/* ----- All Courses List ----- */
exports.viewAllCourseData = async (req, res) => {
    try {

        const findData = await Courses.find({});

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "COURSES DETAILS DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        } else {

            const dataArr = []
            for (const findDataWithTeacher of findData) {

                const findTeacherData = await Teacher.findOne({ unique_code: findDataWithTeacher.unique_code })

                if(findTeacherData) {

                    const response = {
                        _id: findDataWithTeacher._id,
                        teacher_id: findTeacherData._id,
                        unique_code: findDataWithTeacher.unique_code,
                        teacher_profile: findTeacherData.profile,
                        teacher_name: findDataWithTeacher.teacher_name,
                        title: findDataWithTeacher.title,
                        description: findDataWithTeacher.description,
                        skill: findDataWithTeacher.skill,
                        term: findDataWithTeacher.term,
                        criteria: findDataWithTeacher.criteria,
                        fees: findDataWithTeacher.fees,
                        candidate: findDataWithTeacher.candidate
                    }
                    dataArr.push(response)

                } else {

                    const response = {
                        _id: findDataWithTeacher._id,
                        teacher_id: "",
                        unique_code: findDataWithTeacher.unique_code,
                        teacher_profile: "",
                        teacher_name: "",
                        title: findDataWithTeacher.title,
                        description: findDataWithTeacher.description,
                        skill: findDataWithTeacher.skill,
                        term: findDataWithTeacher.term,
                        criteria: findDataWithTeacher.criteria,
                        fees: findDataWithTeacher.fees,
                        candidate: findDataWithTeacher.candidate
                    }
                    dataArr.push(response)

                }

                

            }

            res.status(status.OK).json(
                {
                    message: "COURSES DETAILS SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: dataArr
                }
            )

        }

    } catch (error) {

        console.log("viewAllCourseData::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End All Courses List ----- */


/* ----- Courses Data View By Term ----- */
exports.getCourseDataByTerm = async (req, res) => {
    try {

        const coursesData = await Courses.find({ term: req.body.term , status: 1 });

        if (coursesData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "COURSES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        } else {

            const data = []
            for (const findTeacher of coursesData) {

                const getTeacherData = await Teacher.findOne({ unique_code: findTeacher.unique_code })

                const response = {
                    _id: findTeacher._id,
                    unique_code: findTeacher.unique_code,
                    teacher_profile: getTeacherData.profile,
                    teacher_name: findTeacher.teacher_name,
                    title: findTeacher.title,
                    description: findTeacher.description,
                    skill: findTeacher.skill,
                    term: findTeacher.term,
                    criteria: findTeacher.criteria,
                    fees: findTeacher.fees,
                    candidate: findTeacher.candidate
                }
                data.push(response)
                
            }

            res.status(status.OK).json(
                {
                    message: "COURSES VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: data
                }
            )

        }

    } catch (error) {

        console.log("getCourseDataByTerm::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Courses Data View By Term ----- */


/* ----- Courses Data View By Teacher Code ----- */
exports.getCourseDataByTeacherCode = async (req, res) => {
    try {

        const coursesData = await Courses.find({ unique_code: req.params.unique_code });

        if (coursesData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "COURSES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "COURSES PROFILE VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: coursesData
                }
            )

        }

    } catch (error) {

        console.log("getCourseDataByTeacherCode::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Courses Data View By Teacher Code ----- */


/* ----- delete Course ----- */
exports.deleteCourse = async (req, res) => {
    try {

        const adminId = req.user;

        bcrypt.compare(req.body.password, adminId.password, async (err, comparePassword) => {

            if (comparePassword) {

                const findCourseData = await Courses.findOne({ _id: req.params.id });

                if (findCourseData) {

                    const deleteCourse = await Courses.deleteOne({ _id: req.params.id });
                    const deleteEnrolled = await Enrolled.deleteMany({ course_id: req.params.id });
                    const deleteLecture = await Lecture.deleteMany({ course_id: req.params.id });

                    res.status(status.OK).json(
                        {
                            message: "COURSE DELETE SUCCESSFULLY !",
                            status: true,
                            code: 200
                        }
                    )

                } else {

                    res.status(status.OK).json(
                        {
                            message: "COURSE DOES NOT FOUND!",
                            status: true,
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

        console.log("deleteCourse::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End delete Course ----- */
