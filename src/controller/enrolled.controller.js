const Enrolled = require("../model/enrolled.model");
const Lecture = require("../model/lecture.model");
const Courses = require("../model/courses.model");
const User = require("../model/user.model");
const GroupMember = require("../model/groupMember.model");
const Group = require("../model/group.model");
const status = require('http-status');


/* ----- Insert Course Enrolled ----- */
exports.insertEnrolled = async (req, res) => {
    try {

        const user_id = req.user._id;
        const checkData = await Enrolled.findOne({ course_id: req.body.course_id, user_id: user_id })

        if (checkData) {

            res.status(status.OK).json(
                {
                    message: "YOU HAVE ALREADY ENROLLED FOR THIS COURSE SO YOU CONNOT ENROLLE FOR THIS COURSE !",
                    status: false,
                    code: 406
                }
            )

        } else {

            const findLectureData = await Lecture.findOne({ code: req.body.code })
            console.log("findLectureData", findLectureData);

            if (findLectureData.slot == 0) {

                res.status(status.OK).json(
                    {
                        message: "NOT A SINGLE SLOT IS AVAILABLE FOR THIS LECTURE SO YOU CAN NOT BE ENROLLED IN THIS LECTURE!",
                        status: false,
                        code: 406
                    }
                )

            } else {

                const coursesData = await Courses.findOne({ _id: req.body.course_id })
                const userData = await User.findOne({ _id: user_id });
                const userName = `${userData.first_name} ${userData.last_name ? userData.last_name : ''}`;

                const enrolledDetails = new Enrolled({
                    course_id: req.body.course_id,
                    user_id: user_id,
                    course_title: coursesData.title,
                    user_name: userName.trim(),
                    code: req.body.code
                })
                const saveData = await enrolledDetails.save();

                // UPDATE SLOT
                const updateSlotData = await Lecture.findOneAndUpdate({ code: req.body.code }, {
                    $set: {
                        slot: findLectureData.slot - 1
                    }
                })

                // ADD GROUPMEMBER

                const findGroupData = await Group.findOne({ course_id: req.body.course_id })

                if (findGroupData) {

                    const obj = {
                        user_id: user_id,
                        user_name: userName.trim(),
                        user_img: userData.profile,
                        user_type: 2
                    }

                    const updateMember = await GroupMember.findOneAndUpdate({ groupId: findGroupData._id }, {
                        $push: {
                            users: obj
                        }
                    })

                    // UPDATE GROUPMEMBER COUNT
                    const updateGroupMemberData = await Group.findOneAndUpdate({ course_id: req.body.course_id }, {
                        $set: {
                            group_member: findGroupData.group_member + 1
                        }
                    })

                } else {
                    console.log("There is no group for this course");
                }

                res.status(status.CREATED).json(
                    {
                        message: "ENROLLED INSERT SUCCESSFULLY !",
                        status: true,
                        code: 201,
                        data: saveData
                    }
                )

            }

        }

    } catch (error) {

        console.log("insertEnrolled::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Insert Course Enrolled ----- */


/* ----- How Many User ----- */
exports.howManyEnrolled = async (req, res) => {
    try {

        const enrolledData = await Enrolled.find().count();

        res.status(status.OK).json({
            message: "NUMBER OF ENROLLED IN OUR SYSTEM",
            status: true,
            code: 200,
            data: enrolledData
        })

    } catch (error) {

        console.log("howManyEnrolled::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End How Many User ----- */


/* ----- Get User By Course ----- */
exports.getUserByCourse = async (req, res) => {
    try {

        const enrolledData = await Enrolled.find({ course_id: req.params.course_id });

        const arrData = [];
        for (const findData of enrolledData) {

            const userData = await User.findOne({ _id: findData.user_id });

            const userObj = {
                _id: userData._id,
                profile: userData.profile,
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                password: userData.password,
                gender: userData.gender,
                phone_code: userData.phone_code,
                mobile: userData.mobile,
                whats_app: userData.whats_app,
                city: userData.city,
                second_city: userData.second_city,
                mother_tongue: userData.mother_tongue,
                language: userData.language,
                linkedin_profile: userData.linkedin_profile,
                about_yourself: userData.about_yourself,
                wallet: userData.wallet
            }

            const obj = {
                _id: findData._id,
                course_id: findData.course_id,
                course_title: findData.course_title,
                user: userObj,
                status: findData.status
            }
            arrData.push(obj)

        }

        if (enrolledData[0] == undefined) {

            res.status(status.OK).json({
                message: "ENROLLED USER DOES NOT EXIST",
                status: false,
                code: 404
            })

        } else {

            res.status(status.OK).json({
                message: "ENROLLED USER DETAILS VIEW SUCCESSFULLY",
                status: true,
                code: 200,
                data: arrData
            })

        }

    } catch (error) {

        console.log("getUserByCourse::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Get User By Course ----- */


/* ----- Update Status ----- */
exports.updateStatus = async (req, res) => {
    try {

        const findData = await Enrolled.findOne({ _id: req.params.id })

        if (findData) {

            const updateData = await Enrolled.findByIdAndUpdate({ _id: req.params.id }, {
                $set: {
                    status: req.body.status
                }
            })

            res.status(status.OK).json({
                message: "UPDATE STATUS SUCCESSFULLY",
                status: true,
                code: 200
            })

        } else {

            res.status(status.OK).json({
                message: "ENROLLED USER DOES NOT EXIST",
                status: false,
                code: 404
            })

        }

    } catch (error) {

        console.log("updateStatus::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Update Status ----- */


/* ----- course Wise Enrolled User List ----- */
exports.courseWiseEnrolledUserList = async (req, res) => {
    try {

        const enrolledUserData = await Enrolled.find({ course_id: req.params.course_id });
        // console.log("enrolledUserData", enrolledUserData);

        if (enrolledUserData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "NO USER HAS ENROLLED!",
                    status: false,
                    code: 404
                }
            )

        } else {

            var userArr = []
            for (const userData of enrolledUserData) {

                const userList = await User.findOne({ _id: userData.user_id });
                userArr.push(userList)

            }

            res.status(status.OK).json(
                {
                    message: "ENROLLED USER DETAILS VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: userArr
                }
            )

        }

    } catch (error) {

        console.log("courseWiseEnrolledUserList::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End course Wise Enrolled User List ----- */


/* ----- Lecture Wise User List ----- */
exports.lectureWiseUserList = async (req, res) => {
    try {

        const enrolledUserData = await Enrolled.find({ code: req.params.lecture_code });

        if (enrolledUserData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "NO USER HAS ENROLLED!",
                    status: false,
                    code: 404
                }
            )

        } else {

            var userArr = []
            for (const userData of enrolledUserData) {

                const userList = await User.findOne({ _id: userData.user_id });
                userArr.push(userList)

            }

            res.status(status.OK).json(
                {
                    message: "ENROLLED USER DETAILS VIEW SUCCESSFULLY !",
                    status: true,
                    code: 200,
                    data: userArr
                }
            )

        }

    } catch (error) {

        console.log("lectureWiseUserList::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Lecture Wise User List ----- */


/* ----- course wise user count ----- */
exports.courseWiseUserCount = async (req, res) => {
    try {

        const enrolledData = await Enrolled.find({ course_id: req.params.course_id }).count();

        if (enrolledData == 0) {

            res.status(status.OK).json({
                message: "ENROLLED USER DOES NOT EXIST",
                status: false,
                code: 404
            })

        } else {

            res.status(status.OK).json({
                message: "ENROLLED USER DETAILS VIEW SUCCESSFULLY",
                status: true,
                code: 200,
                data: enrolledData
            })

        }

    } catch (error) {

        console.log("courseWiseUserCount::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End course wise user count ----- */