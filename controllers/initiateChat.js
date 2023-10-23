const expressAsyncHandler = require("express-async-handler")


const initiateChat = expressAsyncHandler(async (req, res) => {
    const { userId, receiverId } = req.body;

    try {
        let chat = await Chat.findOne({
            isGroupChat: false,
            users: { $all: [userId, receiverId] }
        });

        if (!chat) {
            chat = await Chat.create({
                chatName: "Private Chat",
                isGroupChat: false,
                users: [userId, receiverId]
            });
        }

        const chatId = chat._id;

        res.json({ chatId });
    } catch (error) {
        console.error("Error initiating chat:", error);
        res.status(500).json({ msg: "Error initiating chat" });
    }
});

module.exports = { initiateChat };
