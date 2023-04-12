const mongoose = require("mongoose");
const Chat = require("../model/chat.model");
const ChatRoom = require("../model/chatRoom.model");
const Group = require("../model/group.model");
const User = require("../model/user.model");
const Teacher = require("../model/teacher.model");
const GroupChat = require("../model/groupChat.model");
const GroupMember = require("../model/groupMember.model");

function socket(io) {
    console.log("=========================================================================");
    console.log("SETUP :- Socket Loading...");

    io.on("connection", (socket) => {

        /* ----- joinRoom ----- */
        socket.on("joinRoom", (arg) => {
            const userRoom = `User${arg.user_id}`;
            socket.join(userRoom);
        })
        /* ----- End joinRoom ----- */

        /* ----- chat ----- */
        socket.on("chat", async (arg) => {
            const userRoom = `User${arg.receiver_id}`;

            const checkUser1 = await ChatRoom.findOne({
                user1: arg.sender_id,
                user2: arg.receiver_id
            }).select('user1,user2').lean();

            const checkUser2 = await ChatRoom.findOne({
                user1: arg.receiver_id,
                user2: arg.sender_id
            }).select('user1,user2').lean();

            if (checkUser1 == null && checkUser2 == null) {

                const createChatRoom = await ChatRoom({
                    user1: arg.sender_id,
                    user2: arg.receiver_id
                });
                const saveData = await createChatRoom.save();

                const getChatRoom = await ChatRoom.findOne({
                    user1: arg.sender_id,
                    user2: arg.receiver_id
                }).select('user1,user2').lean();

                const getChatRoom2 = await ChatRoom.findOne({
                    user1: arg.receiver_id,
                    user2: arg.sender_id
                }).select('user1,user2').lean();

                if (getChatRoom == null && getChatRoom2 == null) {
                    console.log("enter--1");
                } else {

                    if (getChatRoom) {
                        console.log("enter--2");

                        const updateReadData = await Chat.findOneAndUpdate(
                            {
                                chatRoomId: getChatRoom._id
                            },
                            {
                                $set: {
                                    "chat.$[].read": 1
                                }
                            })

                        const addDataInChat = await Chat({
                            chatRoomId: getChatRoom._id,
                            chat: {
                                sender: arg.sender_id,
                                receiver: arg.receiver_id,
                                message: arg.message
                            }
                        });
                        const saveChatData = await addDataInChat.save();

                        console.log("saveChatData--if--", saveChatData);
                        io.to(userRoom).emit("chatReceive", saveChatData);

                    } else {
                        console.log("enter--3");
                        const updateReadData = await Chat.findOneAndUpdate(
                            {
                                chatRoomId: getChatRoom2._id
                            },
                            {
                                $set: {
                                    "chat.$[].read": 1
                                }
                            })

                        const addDataInChat = await Chat({
                            chatRoomId: getChatRoom2._id,
                            chat: {
                                sender: arg.sender_id,
                                receiver: arg.receiver_id,
                                message: arg.message
                            }
                        });
                        const saveChatData = await addDataInChat.save();

                        console.log("saveChatData--else---", saveChatData);
                        io.to(userRoom).emit("chatReceive", saveChatData);

                    }

                }

            } else {

                const getChatRoom = await ChatRoom.findOne({
                    user1: arg.sender_id,
                    user2: arg.receiver_id
                }).select('user1,user2').lean();

                const getChatRoom2 = await ChatRoom.findOne({
                    user1: arg.receiver_id,
                    user2: arg.sender_id
                }).select('user1,user2').lean();

                if (getChatRoom == null && getChatRoom2 == null) {
                    console.log("enter--4");
                } else {

                    if (getChatRoom) {

                        const findChatRoom = await Chat.findOne({
                            chatRoomId: getChatRoom._id
                        }).lean();
                        console.log("getChatRoom", getChatRoom);

                        if (findChatRoom == null) {
                            console.log("enter--5");

                            const updateReadData = await Chat.findOneAndUpdate(
                                {
                                    chatRoomId: getChatRoom._id
                                },
                                {
                                    $set: {
                                        "chat.$[].read": 1
                                    }
                                })

                            const addDataInChat = await Chat({
                                chatRoomId: getChatRoom._id,
                                chat: {
                                    sender: arg.sender_id,
                                    receiver: arg.receiver_id,
                                    message: arg.message
                                }
                            });
                            const saveChatData = await addDataInChat.save();

                            console.log("saveChatData--other---", saveChatData);
                            io.to(userRoom).emit("chatReceive", saveChatData);

                        } else {
                            console.log("enter--6");
                            const findChatData = await Chat.findOne({ chatRoomId: getChatRoom._id })

                            const allChatData = findChatData.chat
                            const lastChatData = allChatData[allChatData.length - 1]
                            // console.log("lastChatData", lastChatData);

                            if (lastChatData.sender == arg.sender_id) {
                                console.log("same sender che!");
                            } else {

                                const updateReadData = await Chat.findOneAndUpdate(
                                    {
                                        chatRoomId: getChatRoom._id
                                    },
                                    {
                                        $set: {
                                            "chat.$[].read": 1
                                        }
                                    })

                            }

                            const chatData = {
                                sender: arg.sender_id,
                                receiver: arg.receiver_id,
                                message: arg.message
                            }

                            const updateChat = await Chat.updateOne(
                                {
                                    chatRoomId: getChatRoom._id
                                },
                                {
                                    $push: {
                                        chat: chatData
                                    }
                                }
                            )

                            const getChatData = await Chat.findOne({
                                chatRoomId: getChatRoom._id
                            })

                            console.log("getChatData----", getChatData);
                            io.to(userRoom).emit("chatReceive", getChatData);

                        }

                    } else {

                        const findChatRoom2 = await Chat.findOne({
                            chatRoomId: getChatRoom2._id
                        }).lean();
                        console.log("getChatRoom2", getChatRoom2);

                        if (findChatRoom2 == null) {
                            console.log("enter--7");

                            const updateReadData = await Chat.findOneAndUpdate(
                                {
                                    chatRoomId: getChatRoom2._id
                                },
                                {
                                    $set: {
                                        "chat.$[].read": 1
                                    }
                                })

                            const addDataInChat = await Chat({
                                chatRoomId: getChatRoom2._id,
                                chat: {
                                    sender: arg.sender_id,
                                    receiver: arg.receiver_id,
                                    message: arg.message
                                }
                            });
                            const saveChatData = await addDataInChat.save();

                            console.log("saveChatData++---------", saveChatData);
                            io.to(userRoom).emit("chatReceive", saveChatData);

                        } else {
                            console.log("enter--8");

                            const findChatData = await Chat.findOne({ chatRoomId: getChatRoom2._id })

                            const allChatData = findChatData.chat
                            const lastChatData = allChatData[allChatData.length - 1]
                            // console.log("lastChatData", lastChatData);

                            if (lastChatData.sender == arg.sender_id) {
                                console.log("same sender che!");
                            } else {

                                const updateReadData = await Chat.findOneAndUpdate(
                                    {
                                        chatRoomId: getChatRoom2._id
                                    },
                                    {
                                        $set: {
                                            "chat.$[].read": 1
                                        }
                                    })

                            }

                            const chatData = {
                                sender: arg.sender_id,
                                receiver: arg.receiver_id,
                                message: arg.message
                            }

                            const updateChat = await Chat.updateOne(
                                {
                                    chatRoomId: getChatRoom2._id
                                },
                                {
                                    $push: {
                                        chat: chatData
                                    }
                                }
                            )

                            const getChatData2 = await Chat.findOne({
                                chatRoomId: getChatRoom2._id
                            })

                            console.log("getChatData-hehehe--+++", getChatData2);
                            io.to(userRoom).emit("chatReceive", getChatData2);

                        }

                    }

                }

            }

        })
        /* ----- End chat ----- */

        /* ----- readUnread ----- */
        socket.on("readUnread", async (arg) => {

            const userRoom = `User${arg.receiver_id}`;
            // console.log("--arg--", arg.receiver_id);

            const findChatRoom = await Chat.findOne({
                chatRoomId: arg.chat_room_id,
                "chat.receiver": arg.receiver_id
            });
            // console.log("--findChatRoom--", findChatRoom);

            if (findChatRoom == null) {

                io.to(userRoom).emit("readChat", "chatRoom Not Found")

            } else {

                for (const getSenderChat of findChatRoom.chat) {

                    const updateReadValue = await Chat.updateOne(
                        {
                            chatRoomId: arg.chat_room_id,
                            chat: {
                                $elemMatch: {
                                    receiver: mongoose.Types.ObjectId(arg.receiver_id)
                                }
                            }
                        },
                        {
                            $set: {
                                'chat.$[chat].read': 1
                            }
                        },
                        {
                            arrayFilters: [
                                {
                                    'chat.receiver': mongoose.Types.ObjectId(arg.receiver_id)
                                }
                            ]
                        }
                    );
                }
                io.to(userRoom).emit("readChat", "CHAT HAS BEEN READ")

            }

        })
        /* ----- End readUnread ----- */

        /* ----- groupChat ----- */
        socket.on("groupChat", async (arg) => {
            // group_id, sender_id, message

            const fingGroup = await Group.findOne({ _id: arg.group_id });
            // console.log("fingGroup", fingGroup);

            const findUser = await User.findOne({ _id: arg.sender_id })
            // console.log("findUser", findUser);

            const findTeacher = await Teacher.findOne({ _id: arg.sender_id })
            // console.log("findTeacher", findTeacher);

            const checkGroupMember = await GroupMember.find({ groupId: arg.group_id, 'users.user_id': arg.sender_id })
            // console.log("checkGroupMember", checkGroupMember);

            const findGroupChat = await GroupChat.findOne({ groupId: arg.group_id });

            if (fingGroup) {

                if (checkGroupMember[0] == undefined) {

                    console.log("checkGroupMember--YOU ARE NOT A MEMBER OF THE GROUP");
                    io.emit("groupChatMessage", "YOU ARE NOT A MEMBER OF THE GROUP!")

                } else {

                    const userArr = []
                    for (const checkUserType of checkGroupMember[0].users) {
                        if (checkUserType.user_id == arg.sender_id) {
                            userArr.push(checkUserType)
                        }
                    }
                    // console.log("userArr", userArr);

                    if (userArr[0].user_type == 1) {
                        console.log("I AM TEACHER");

                        if (findTeacher) {

                            const userName = `${findTeacher.first_name} ${findTeacher.last_name ? findTeacher.last_name : ''}`;
                            if (findGroupChat) {

                                const updateGroupChatData = await GroupChat.findOneAndUpdate({ groupId: arg.group_id }, {
                                    $push: {
                                        chat: {
                                            sender: arg.sender_id,
                                            senderName: userName.trim(),
                                            senderImg: findTeacher.profile,
                                            message: arg.message
                                        }
                                    }
                                })

                                for (const userData of checkGroupMember[0].users) {
                                    console.log("userData", userData.user_id);

                                    if (userData.user_id == arg.sender_id) {
                                        console.log("condition::", userData.user_id == arg.sender_id);
                                    } else {

                                        const userRoom = `User${userData.user_id}`;

                                        const response = {
                                            sender: arg.sender_id,
                                            userName: userData.user_name,
                                            message: arg.message
                                        }
                                        io.to(userRoom).emit("groupChatMessage", response)

                                    }

                                }


                            } else {

                                const addGroupChatData = new GroupChat({
                                    groupId: arg.group_id,
                                    groupName: fingGroup.group_name,
                                    chat: {
                                        sender: arg.sender_id,
                                        senderName: userName.trim(),
                                        senderImg: findTeacher.profile,
                                        message: arg.message
                                    }
                                })
                                const saveData = await addGroupChatData.save();

                                for (const userData of checkGroupMember[0].users) {
                                    console.log("userData", userData.user_id);

                                    if (userData.user_id == arg.sender_id) {
                                        console.log("condition::", userData.user_id == arg.sender_id);
                                    } else {

                                        const userRoom = `User${userData.user_id}`;

                                        const response = {
                                            sender: arg.sender_id,
                                            userName: userData.user_name,
                                            message: arg.message
                                        }
                                        io.to(userRoom).emit("groupChatMessage", response)

                                    }

                                }

                            }

                        } else {
                            console.log("findUser--TEACHER NOT EXIST");
                            io.emit("groupChatMessage", "TEACHER NOT EXIST!")
                        }

                    } else {
                        console.log("I AM STUDENT");

                        if (findUser) {

                            const userName = `${findUser.first_name} ${findUser.last_name ? findUser.last_name : ''}`;
                            if (findGroupChat) {

                                const updateGroupChatData = await GroupChat.findOneAndUpdate({ groupId: arg.group_id }, {
                                    $push: {
                                        chat: {
                                            sender: arg.sender_id,
                                            senderName: userName.trim(),
                                            senderImg: findUser.profile,
                                            message: arg.message
                                        }
                                    }
                                })

                                for (const userData of checkGroupMember[0].users) {
                                    console.log("userData", userData.user_id);

                                    if (userData.user_id == arg.sender_id) {
                                        console.log("condition::", userData.user_id == arg.sender_id);
                                    } else {

                                        const userRoom = `User${userData.user_id}`;

                                        const response = {
                                            sender: arg.sender_id,
                                            userName: userData.user_name,
                                            message: arg.message
                                        }
                                        io.to(userRoom).emit("groupChatMessage", response)

                                    }

                                }

                            } else {

                                const addGroupChatData = new GroupChat({
                                    groupId: arg.group_id,
                                    groupName: fingGroup.group_name,
                                    chat: {
                                        sender: arg.sender_id,
                                        senderName: userName.trim(),
                                        senderImg: findUser.profile,
                                        message: arg.message
                                    }
                                })
                                const saveData = await addGroupChatData.save();

                                for (const userData of checkGroupMember[0].users) {
                                    console.log("userData", userData.user_id);

                                    if (userData.user_id == arg.sender_id) {
                                        console.log("condition::", userData.user_id == arg.sender_id);
                                    } else {

                                        const userRoom = `User${userData.user_id}`;

                                        const response = {
                                            sender: arg.sender_id,
                                            userName: userData.user_name,
                                            message: arg.message
                                        }
                                        io.to(userRoom).emit("groupChatMessage", response)

                                    }

                                }

                            }

                        } else {
                            console.log("findUser--USER NOT EXIST");
                            io.emit("groupChatMessage", "USER NOT EXIST!")
                        }

                    }

                }

            } else {
                console.log("fingGroup--GROUP NOT EXIST");
                io.emit("groupChatMessage", "GROUP NOT EXIST!")
            }

        })
        /* ----- End groupChat ----- */

    })
}

module.exports = socket


