const Group = require("../model/group.model")
const Teacher = require("../model/teacher.model");
const Courses = require("../model/courses.model");
const GroupMember = require("../model/groupMember.model");
const GroupChat = require("../model/groupChat.model");
const status = require('http-status');
const nodemailer = require("nodemailer");
const cloudinary = require("../util/cloudinary.util");


/* ----- Create Group ----- */
exports.createGroup = async (req, res) => {
    try {

        const checkTeacherData = await Teacher.findOne({ _id: req.params.teacherId })

        if (checkTeacherData) {

            const checkCourseData = await Courses.findOne({ _id: req.body.course_id, unique_code: checkTeacherData.unique_code })

            if (checkCourseData) {

                const checkGroup = await Group.findOne({ user_id: req.params.teacherId, course_id: req.body.course_id })

                if (checkGroup) {

                    res.status(status.OK).json(
                        {
                            message: "GROUP IS ALREADY EXIST!",
                            status: false,
                            code: 406
                        }
                    )

                } else {

                    const cloudinaryImageUploadMethod = async file => {
                        return new Promise(resolve => {
                            cloudinary.uploader.upload(file, (err, res) => {
                                if (err) return err
                                resolve({
                                    res: res.secure_url
                                })
                            })
                        })
                    }

                    const files = req.file;

                    const newPath = await cloudinaryImageUploadMethod(files.path);

                    const addGroupData = new Group({
                        user_id: req.params.teacherId,
                        course_id: req.body.course_id,
                        group_img: newPath.res,
                        group_name: req.body.group_name,
                        group_desc: req.body.group_desc
                    })
                    const saveData = await addGroupData.save();


                    // ADD GROUPMEMBER
                    const teacherName = `${checkTeacherData.first_name} ${checkTeacherData.last_name ? checkTeacherData.last_name : ''}`;

                    const obj = {
                        user_id: req.params.teacherId,
                        user_name: teacherName.trim(),
                        user_img: checkTeacherData.profile,
                        user_type: 1
                    }

                    const groupMemberDetails = new GroupMember({
                        groupId: saveData._id,
                        users: obj
                    })
                    const saveMemberData = await groupMemberDetails.save();

                    res.status(status.CREATED).json(
                        {
                            message: "GROUP CREATE SUCCESSFULLY !",
                            status: true,
                            code: 201,
                            data: saveData
                        }
                    )

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

        } else {

            res.status(status.OK).json(
                {
                    message: "TEACHER DOES NOT EXISTS !",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("createGroup::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Create Group ----- */


/* ----- Get Group Chat By Group Id ----- */
exports.getGroupChatByGroupId = async (req, res) => {
    try {

        const findGroupChat = await GroupChat.findOne({ groupId: req.params.group_id })

        if (findGroupChat) {

            res.status(status.OK).json(
                {
                    message: "GROUP CHAT VIEW SUCCESSFULLY!",
                    status: true,
                    code: 200,
                    data: findGroupChat
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "GROUP CHAT NOT EXIST!",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("getGroupChatByGroupId::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Get Group Chat By Group Id ----- */


/* ----- Get Group By User Id ----- */
exports.getGroupByUserId = async (req, res) => {
    try {

        const findGroupMemberData = await GroupMember.find({ 'users.user_id': req.params.user_id })
        console.log("findGroupMemberData", findGroupMemberData);

        if (findGroupMemberData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "GROUP NOT FOUND!",
                    status: false,
                    code: 404
                }
            )

        } else {

            const groupArr = []
            for (const findGroup of findGroupMemberData) {

                const findGroupData = await Group.findOne({ _id: findGroup.groupId })
                groupArr.push(findGroupData)

            }

            res.status(status.OK).json(
                {
                    message: "GROUP VIEW SUCCESSFULLY!",
                    status: true,
                    code: 200,
                    data: groupArr
                }
            )

        }

    } catch (error) {

        console.log("getGroupChatByUserId::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Get Group By User Id ----- */


/* ----- Get Group By Id ----- */
exports.getGroupById = async (req, res) => {
    try {

        const findGroup = await Group.findOne({ _id: req.params.id })

        if (findGroup) {

            res.status(status.OK).json(
                {
                    message: "GROUP VIEW SUCCESSFULLY!",
                    status: true,
                    code: 200,
                    data: findGroup
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "GROUP NOT EXIST!",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("getGroupByGroupId::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Get Group Chat By Group Id ----- */
