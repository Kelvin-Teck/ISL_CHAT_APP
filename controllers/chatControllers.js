const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chat");
const User = require("../models/Users");
const initiateChat = require("./initiateChat")

const accessChat = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;

    try {
        if (!userId) {
            return res.status(400).json({ msg: "User ID is required in the request body" });
        }

        // Find or create a chat
        const chatResponse = await initiateChat(userId, req.user._id);

        // Check if chat was created or retrieved
        if (!chatResponse.success) {
            return res.status(500).json({ msg: "Failed to create or access chat" });
        }

        const chatId = chatResponse.chatId;

        // Find the chat and populate relevant details
        const existingChat = await Chat.findOne({
            isGroupChat: false,
            users: { $all: [req.user._id, userId] }
        }).populate("users", "-password").populate("latestMessage");

        if (existingChat) {
            return res.status(200).json(existingChat);
        }

        const chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
            _id: chatId 
        };

        
        const updatedChat = await Chat.findByIdAndUpdate(chatId, chatData, { new: true })
            .populate("users", "-password");

        if (!updatedChat) {
            throw new Error("Chat creation or update failed");
        }

        res.status(201).json(updatedChat);
    } catch (error) {
        console.error("Error creating or accessing chat:", error);
        res.status(500).json({ msg: "Failed to create or access chat" });
    }
});


const fetchChats = expressAsyncHandler(async (req, res) => {
    try {
        const results = await Chat.find({ users: req.user._id })
            .populate("users", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        const populatedResults = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name email"
        });

        res.status(200).send(populatedResults);
    } catch (error) {
        res.status(400).json({ msg: "Fetching chats failed" });
    }
});

const fetchGroups = expressAsyncHandler(async (req, res) => {
    try {
        const allGroups = await Chat.find({ isGroupChat: true });
        res.status(200).json(allGroups);
    } catch (error) {
        res.status(400).json({ msg: "Fetching chats failed" });
    }
});


const fetchChatsAndGroups = expressAsyncHandler(async (req, res) => {
    try {
        const chats = await Chat.find({
            $or: [
                { users: req.user._id },
                { isGroupChat: true }
            ]
        })
            .populate("users", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        // Separate the chats into individual and group chats
        const individualChats = chats.filter(chat => !chat.isGroupChat);
        const groupChats = chats.filter(chat => chat.isGroupChat);

        const populatedIndividualChats = await User.populate(individualChats, {
            path: "latestMessage.sender",
            select: "name email"
        });

        res.status(200).json({ individualChats: populatedIndividualChats, groupChats });
    } catch (error) {
        res.status(400).json({ msg: "Fetching chats failed" });
    }
});


const createGroupChat = expressAsyncHandler(async (req, res) => {
    const { users, name } = req.body;

    if (!users || users.length === 0 || !name) {
        return res.status(400).json({ msg: "Please include valid users and group name" });
    }

    // Fetch user IDs and names for the provided usernames
    const usersWithNames = await User.find({ name: { $in: users } }).select("name");

    if (usersWithNames.length === 0) {
        return res.status(400).json({ msg: "No valid users found for the provided usernames" });
    }

    try {
        // Check if a group with the given name already exists
        const existingGroup = await Chat.findOne({ chatName: name, isGroupChat: true });

        if (existingGroup) {
            return res.status(400).json({ msg: "A group with this name already exists" });
        }

        const groupChat = await Chat.create({
            chatName: name,
            users: usersWithNames,
            isGroupChat: true,
            groupAdmin: req.user._id
        });

        res.status(201).json(groupChat);
    } catch (error) {
        console.error("Error creating group chat:", error);
        res.status(400).json({ msg: `An error occurred: ${error.message}` });
    }
});

const addUserToGroup = expressAsyncHandler(async (req, res) => {
    const { groupChatId, usernames } = req.body;

    try {
        // Find the group chat
        const groupChat = await Chat.findById(groupChatId);
        if (!groupChat) {
            return res.status(404).json({ msg: "Group chat not found" });
        }

        // Check if the current user is the group admin
        const isAdmin = groupChat.groupAdmin.equals(req.user._id);
        if (!isAdmin) {
            return res.status(403).json({ msg: "Only the group admin can add users to the group" });
        }

        // Fetch user IDs for the provided usernames
        const usersToAdd = await User.find({ name: { $in: usernames } });
        if (usersToAdd.length === 0) {
            return res.status(400).json({ msg: "No valid users found for the provided usernames" });
        }

        // Add the users to the group
        groupChat.users.push(...usersToAdd);
        await groupChat.save();

        res.json({ msg: "Users added to the group successfully" });
    } catch (error) {
        console.error("Error adding users to the group:", error);
        res.status(500).json({ msg: "Failed to add users to the group" });
    }
});

const removeUserFromGroup = expressAsyncHandler(async (req, res) => {
  const { chatName, usernames } = req.body;

  try {
    // Find the group chat based on chatName
    const groupChat = await Chat.findOne({ chatName });
    if (!groupChat) {
      return res.status(404).json({ msg: "Group chat not found" });
    }

    // Check if the current user is the group admin
    const isAdmin = groupChat.groupAdmin.equals(req.user._id);
    if (!isAdmin) {
      return res.status(403).json({ msg: "Only the group admin can remove users from the group" });
    }

    // Remove the specified users from the group
    groupChat.users = groupChat.users.filter(user => !usernames.includes(user));

    // Update the group chat in the database by saving the changes
    console.log("Filtered users:", groupChat.users);
    await groupChat.save(); // Save the updated user list back to the database

    res.json({ msg: "Users removed from the group successfully" });
  } catch (error) {
    console.error("Error removing users from the group:", error);
    res.status(500).json({ msg: "Failed to remove users from the group" });
  }
});


// const groupExit = expressAsyncHandler(async(req, res) => {
//     const { chatId, userId} = req.body;

//     // check if the requester is admin

//     const removed = User.findByIdAndUpdate({})

//         .populate("users", "-password")
//         .populate("groupAdmin", "-password")

//     if(!removed){
//         res.status(404);
//         throw new Error("Chat Not found");
//     } else{
//         res.json(removed)
//     }
// })

module.exports = { accessChat, fetchChats, fetchGroups, createGroupChat, addUserToGroup, removeUserFromGroup, fetchChatsAndGroups };
