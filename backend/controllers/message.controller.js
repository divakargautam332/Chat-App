import Message from "../models/message.model.js";

// Send message
export const sendMessage = async (req, res, next) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.receiverId;
        const { message } = req.body;
        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });
        await newMessage.save();
        res.status(201).json({
            success: true,
            data: newMessage
        });
    } catch (error) {
        next(error);
    }
};

// Get messages between two users
export const getMessages = async (req, res, next) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.receiverId;
        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            data: messages
        });

    } catch (error) {
        next(error);
    }
};
