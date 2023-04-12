const ChatRoom = require("../model/chatRoom.model");
const Chat = require("../model/chat.model");
const User = require("../model/user.model");
const status = require('http-status');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


/* ----- Create ChatRoom ----- */
exports.joinChatRoom = async (req, res) => {
    try {

        const checkChatRoom = await ChatRoom.findOne({ user1: req.body.sender_id, user2: req.body.receiver_id });

        if (checkChatRoom) {

            res.status(status.OK).json(
                {
                    message: "CHAT ROOM ALREADY CREADED!",
                    status: false,
                    code: 406,
                    data: { "_id": checkChatRoom._id }
                }
            )

        } else {

            const checkChatRoom = await ChatRoom.findOne({ user1: req.body.receiver_id, user2: req.body.sender_id })

            if (checkChatRoom) {

                res.status(status.OK).json(
                    {
                        message: "CHAT ROOM ALREADY CREATED!",
                        status: false,
                        code: 406,
                        data: { "_id": checkChatRoom._id }
                    }
                )

            } else {

                const createChatRoom = await ChatRoom({
                    user1: req.body.sender_id,
                    user2: req.body.receiver_id
                });
                const saveData = await createChatRoom.save();

                res.status(status.CREATED).json(
                    {
                        message: "CHAT ROOM CREATE SUCCESSFULLY!",
                        status: true,
                        code: 201,
                        data: saveData
                    }
                )

            }

        }

    } catch (error) {

        console.log("joinChatRoom::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Create ChatRoom ----- */


/* ----- get Chat By User Id ----- */
exports.getChatByUserId = async (req, res) => {
    try {

        const userId = req.params.userId
        // console.log("userId", userId);

        const getchatRoomData = await ChatRoom.find({
            $or: [
                { user1: userId },
                { user2: userId }
            ]
        })
        // console.log("getchatRoomData", getchatRoomData);

        if (getchatRoomData[0] == undefined) {

            res.status(status.OK).json(
                {
                    message: "CHATROOM NOT FOUND!",
                    status: false,
                    code: 404
                }
            )

        } else {

            const data = []
            for (const getChatRoomId of getchatRoomData) {

                const getChatRoom = await Chat.findOne({ chatRoomId: getChatRoomId._id })
                // console.log("getChatRoom", getChatRoom);

                if (getChatRoom == null) {

                    const findChatRoomData = await ChatRoom.findOne({ _id: getChatRoomId._id })
                    console.log("findChatRoomData", findChatRoomData);

                    var user_id = ""
                    if (findChatRoomData.user1 == userId) {
                        user_id = findChatRoomData.user2
                    } else {
                        user_id = findChatRoomData.user1
                    }
                    // console.log("user_id", user_id);
                    
                    const getUserData = await User.findOne({ _id: user_id })
                    // console.log("getUserData", getUserData);

                    const userName = `${getUserData.first_name} ${getUserData.last_name ? getUserData.last_name : ''}`;
                    // console.log("userName", userName);
                    const response = {
                        user_id: getUserData._id,
                        profile: getUserData.profile,
                        username: userName.trim(),
                        chatRoomId: getChatRoomId._id,
                        receiverId: user_id,
                        lastMessage: "",
                        unreadMsgCount: 0
                    }
                    data.push(response)
                    // console.log("response", response);

                } else {

                    const findChatRoomData = await ChatRoom.findOne({ _id: getChatRoom.chatRoomId })
                    // console.log("findChatRoomData", findChatRoomData);

                    var user_id = ""
                    if (findChatRoomData.user1 == userId) {
                        user_id = findChatRoomData.user2
                    } else {
                        user_id = findChatRoomData.user1
                    }

                    const getUserData = await User.findOne({ _id: user_id })
                    // console.log("getUserData", getUserData);

                    const allChatData = getChatRoom.chat
                    const lastChatData = allChatData[allChatData.length - 1]
                    // console.log("allChatData", allChatData);
                    // console.log("lastChatData", lastChatData);

                    var unReadCount = 0;
                    for (const count of allChatData) {

                        if (count.receiver == userId) {

                            if (count.read == 0) {
                                // console.log("count", count);
                                unReadCount = unReadCount + 1
                            }

                        }

                    }
                    // console.log("unReadCount", unReadCount);

                    const userName = `${getUserData.first_name} ${getUserData.last_name ? getUserData.last_name : ''}`;
                    // console.log("userName", userName);
                    const response = {
                        user_id: getUserData._id,
                        profile: getUserData.profile,
                        username: userName.trim(),
                        chatRoomId: getChatRoom.chatRoomId,
                        receiverId: user_id,
                        lastMessage: lastChatData.message,
                        unreadMsgCount: unReadCount
                    }
                    data.push(response)
                    // console.log("response", response);

                }

            }

            res.status(status.OK).json(
                {
                    message: "VIEW CHAT BY USER ID!",
                    status: true,
                    code: 200,
                    data: data
                }
            )

        }

    } catch (error) {

        console.log("getChatByUserId::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End get Chat By User Id ----- */


/* ----- Get All Chat By ChatRoomId ----- */
exports.getChatByChatRoomId = async (req, res) => {
    try {

        const findChatData = await Chat.findOne({ chatRoomId: req.params.chatRoomId });

        if (findChatData) {

            res.status(status.OK).json(
                {
                    message: "CHAT VIEW SUCCESSFULLY!",
                    status: true,
                    code: 200,
                    data: findChatData
                }
            )

        } else {

            res.status(status.OK).json(
                {
                    message: "CHAT NOT FOUND!",
                    status: false,
                    code: 404
                }
            )

        }

    } catch (error) {

        console.log("getChatByChatRoomId::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End Get All Chat By ChatRoomId ----- */


/* ----- remaining User ----- */
exports.remainingUser = async (req, res) => {
    try {

        const userId = req.params.userId
        const getchatRoomData = await ChatRoom.find({
            $or: [
                { user1: userId },
                { user2: userId }
            ]
        });
        // console.log("getchatRoomData", getchatRoomData);

        if (getchatRoomData[0] == undefined) {

            const findUserData = await User.find({
                _id: {
                    $ne: userId
                }
            })

            res.status(status.OK).json(
                {
                    message: "USER VIEW SUCCESSFULLY!",
                    status: false,
                    code: 200,
                    data: findUserData
                }
            )

        } else {

            const findUserData = await User.find()
            // console.log("findUserData" , findUserData);

            const userArr = []
            for (const userIdList of getchatRoomData) {

                // console.log("userIdList", userIdList);
                userArr.push({ _id: userIdList.user1 }, { _id: userIdList.user2 })

            }
            // console.log("userArr", userArr);

            jsonObject = userArr.map(JSON.stringify);

            uniqueSet = new Set(jsonObject);
            uniqueArray = Array.from(uniqueSet).map(JSON.parse);

            // console.log("uniqueArray", uniqueArray);

            var remainingUserList = findUserData.filter(function (data) {
                console.log("data" , data);
                return !uniqueArray.some(function (o2) {
                    return (data._id).toString() == (o2._id).toString();          // assumes unique id
                });
            })

            console.log("remainingUserList", remainingUserList);

            res.status(status.OK).json(
                {
                    message: "REMAINING USER LIST VIEW SUCCESSFULLY!",
                    status: true,
                    code: 200,
                    data: remainingUserList
                }
            )
        }

    } catch (error) {

        console.log("remainingUser::error", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "SOMETHING WENT WRONG",
            status: false,
            code: 500
        })

    }
}
/* ----- End remaining User ----- */
