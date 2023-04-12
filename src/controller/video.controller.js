const Video = require("../model/video.model");
const Courses = require("../model/courses.model");
const Enrolled = require("../model/enrolled.model");
const nodemailer = require("nodemailer");
const cloudinary = require("../util/cloudinary.util");
const status = require('http-status');


/* ----- Insert Video ----- */
exports.insertVideo = async (req, res) => {
    try {

        const teacherData = req.user

        const coursesData = await Courses.findOne({ _id: req.params.course_id })

        if (coursesData) {

            const cloudinaryImageUploadMethod = async file => {
                return new Promise(resolve => {
                    cloudinary.uploader.upload(file, {resource_type: "auto"}, (err, res) => {
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

            const videoDetails = new Video({
                course_id: req.params.course_id,
                teacher_id: teacherData._id,
                video: urls,
                title: req.body.title,
                desc: req.body.desc
            })
            const saveData = await videoDetails.save();

            res.status(status.CREATED).json(
                {
                    message: "VIDEO INSERT SUCCESSFULLY!",
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

        console.log("insertVideo::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Insert Video ----- */


/* ----- Update Video ----- */
exports.updateVideo = async (req, res) => {
    try {

        const teacherData = req.user

        const assginmentData = await Video.findOne({ _id: req.params.id, teacher_id: teacherData._id })

        if (assginmentData) {

            if (req.files == undefined) { 

                const updateData = await Video.findOneAndUpdate({ _id: req.params.id }, {
                    $set: {
                        title: req.body.title,
                        desc: req.body.desc
                    }
                })
    
                res.status(status.OK).json(
                    {
                        message: "VIDEO UPDATE SUCCESSFULLY!",
                        status: true,
                        code: 200
                    }
                )

            } else {

                const cloudinaryImageUploadMethod = async file => {
                    return new Promise(resolve => {
                        cloudinary.uploader.upload(file, {resource_type: "auto"}, (err, res) => {
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
    
                const updateData = await Video.findOneAndUpdate({ _id: req.params.id }, {
                    $set: {
                        video: urls,
                        title: req.body.title,
                        desc: req.body.desc
                    }
                })
    
                res.status(status.OK).json(
                    {
                        message: "VIDEO UPDATE SUCCESSFULLY!",
                        status: true,
                        code: 200
                    }
                )

            }

        } else {

            res.status(status.OK).json(
                {
                    message: "VIDEO NOT FOUND!",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("updateVideo::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Update Video ----- */


/* ----- View All Video ----- */
exports.viewAllVideo = async (req, res) => {
    try {

        const findData = await Video.find({});

        if (findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "VIDEO DETAILS DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "VIDEO DETAILS SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }

    } catch (error) {

        console.log("viewAllVideo::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End View All Video ----- */


/* ----- Get Video By User Id ----- */
exports.getVideoByUserId = async (req, res) => {
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
            for (const findVideoData of findEnrolledData) {

                const findData = await Video.find({ course_id: findVideoData.course_id })

                for (const lastData of findData) {
                    dataArr.push(lastData)
                }

                
            }
            // console.log("dataArr", dataArr);

            res.status(status.OK).json(
                {
                    message: "VIDEO VIEW SUCCESSFULLY!",
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


/* ----- Get Video By Teacher Id ----- */
exports.getVideoByTeacherId = async (req, res) => {
    try {

        const teacherData = req.user

        const findData = await Video.find({ teacher_id: teacherData._id })

        if(findData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "VIDEOS NOT EXISTS!",
                    status: false,
                    code: 404
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "VIDEOS VIEW SUCCESSFULLY!",
                    status: true,
                    code: 200,
                    data: findData
                }
            )

        }
        
    } catch (error) {

        console.log("getVideoByTeacherId::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })
        
    }
}
/* ----- End Get Video By Teacher Id ----- */


/* ----- Video Delete ----- */
exports.deleteVideo = async (req, res) => {
    try {

        const teacherData = req.user

        const findData = await Video.findOne({ _id: req.params.id , teacher_id : teacherData._id })

        if(findData) {

            const deleteVideo = await Video.deleteOne({ _id: req.params.id })
            res.status(status.OK).json(
                {
                    message: "VIDEO DELETE SUCCESSFULLY!",
                    status: true,
                    code: 200
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "VIDEO NOT EXISTS!",
                    status: false,
                    code: 404
                }
            )

        }
        
    } catch (error) {

        console.log("deleteVideo::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })
        
    }
}
/* ----- End Video Delete ----- */