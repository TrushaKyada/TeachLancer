const Assignment = require("../model/assignment.model");
const Courses = require("../model/courses.model");
const Enrolled = require("../model/enrolled.model");
const nodemailer = require("nodemailer");
const cloudinary = require("../util/cloudinary.util");
const status = require('http-status');


/* ----- Insert Assignment ----- */
exports.insertAssignment = async (req, res) => {
    try {

        const teacherData = req.user;

        const coursesData = await Courses.findOne({ _id: req.params.course_id })

        if (coursesData) {

            const cloudinaryImageUploadMethod = async file => {
                return new Promise(resolve => {
                    cloudinary.uploader.upload(file, (err, res) => {
                        if (err) return res.status(status.INTERNAL_SERVER_ERROR).send("upload image error")
                        resolve({
                            res: res.secure_url
                        })
                    })
                })
            }

            const urls = [];
            const files = req.files;
            console.log("data:---------", req.files);

            for (const file of files) {
                const { path } = file

                const newPath = await cloudinaryImageUploadMethod(path);
                urls.push(newPath);
            }

            const assignmentDetails = new Assignment({
                course_id: req.params.course_id,
                teacher_id: teacherData._id,
                image: urls
            })
            const saveData = await assignmentDetails.save();

            res.status(status.CREATED).json(
                {
                    message: "ASSIGNMENT INSERT SUCCESSFULLY!",
                    status: true,
                    code: 201,
                    data: saveData
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "COURSE NOT FOUND!",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("insertAssignment::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Insert Assignment ----- */


/* ----- Update Assignment ----- */
exports.updateAssignment = async (req, res) => {
    try {

        const teacherData = req.user

        const assginmentData = await Assignment.findOne({ _id: req.params.id , teacher_id: teacherData._id })

        if (assginmentData) {

            const cloudinaryImageUploadMethod = async file => {
                return new Promise(resolve => {
                    cloudinary.uploader.upload(file, (err, res) => {
                        if (err) return res.status(status.INTERNAL_SERVER_ERROR).send("upload image error")
                        resolve({
                            res: res.secure_url
                        })
                    })
                })
            }

            const urls = [];
            const files = req.files;
            // console.log("data:---------", req.files);

            for (const file of files) {
                const { path } = file

                const newPath = await cloudinaryImageUploadMethod(path);
                urls.push(newPath);
            }

            const updateData = await Assignment.findOneAndUpdate({ _id: req.params.id },{
                $set: {
                    image: urls
                }
            })

            res.status(status.OK).json(
                {
                    message: "ASSIGNMENT UPDATE SUCCESSFULLY!",
                    status: true,
                    code: 200
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "ASSIGNMENT NOT FOUND!",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("updateAssignment::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Update Assignment ----- */


/* ----- View All Assignment ----- */
exports.viewAllAssignment = async (req, res) => {
    try {

        const findData = await Assignment.find({});

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "ASSIGNMENT DETAILS DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "ASSIGNMENT DETAILS SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("viewAllAssignment::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End View All Assignment ----- */


/* ----- Get Assignment By User Id ----- */
exports.getAssignmentByUserId = async (req, res) => {
    try {
        const userData = req.user

        const findEnrolledData = await Enrolled.find({ user_id : userData._id },{course_id: 1,_id:0})
        // console.log("findEnrolledData", findEnrolledData);

        if(findEnrolledData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "ENROLLED DATA DOES NOT EXISTS!",
                    status: false,
                    code: 404
                }
            )

        } else {

            const dataArr = []
            for (const findAssignmentData of findEnrolledData) {

                const findData = await Assignment.find({ course_id: findAssignmentData.course_id })

                for (const lastData of findData) {
                    dataArr.push(lastData)
                }

                
            }
            // console.log("dataArr", dataArr);

            res.status(status.OK).json(
                {
                    message: "ASSIGNMENT VIEW SUCCESSFULLY!",
                    status: true,
                    code: 200,
                    data: dataArr
                }
            )

        }
        
    } catch (error) {

        console.log("getAssignmentByUserId::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })
        
    }
}
/* ----- End Get Assignment By User Id ----- */


/* ----- Get Assignment By Teacher Id ----- */
exports.getAssignmentByTeacherId = async (req, res) => {
    try {

        const teacherData = req.user

        const findData = await Assignment.find({ teacher_id: teacherData._id })

        if(findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "ASSIGNMENTS NOT EXISTS!",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "ASSIGNMENT VIEW SUCCESSFULLY!",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }
        
    } catch (error) {

        console.log("getAssignmentByTeacherId::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })
        
    }
}
/* ----- End Get Assignment By Teacher Id ----- */


/* ----- Assignment Delete ----- */
exports.deleteAssignment = async (req, res) => {
    try {

        const teacherData = req.user

        const findData = await Assignment.findOne({ _id: req.params.id , teacher_id : teacherData._id })

        if(findData) {

            const deleteAssignmentData = await Assignment.deleteOne({ _id: req.params.id })
            res.status(status.OK).json(
                {
                    message: "ASSIGNMENT DELETE SUCCESSFULLY!",
                    status: true,
                    code: 200
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "ASSIGNMENT NOT EXISTS!",
                    status: false,
                    code: 404
                }
            )

        }
        
    } catch (error) {

        console.log("deleteAssignment::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })
        
    }
}
/* ----- End Assignment Delete ----- */