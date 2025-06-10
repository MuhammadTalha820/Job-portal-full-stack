
// import { getReceiverSocketId, io } from "../socket/socket.js";

import { conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        let gotConversation = await conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!gotConversation) {
            gotConversation = await conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
        };


        await Promise.all([gotConversation.save(), newMessage.save()]);

        // SOCKET IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        return res.status(201).json({
            newMessage
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
// export const getMessage = async (req, res) => {
//     try {
//         const receiverId = req.params.id;
//         const senderId = req.id;

//         const gotConversation = await conversation.findOne({
//             participants: { $all: [senderId, receiverId] }
//         }).populate("messages");



//         // ✅ Always return an array
//         res.status(200).json({ messages: gotConversation?.messages || [] });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };
export const getMessage = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;

        const gotConversation = await conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        if (!gotConversation) {
            return res.status(200).json({ messages: [] });
        }

        res.status(200).json({ messages: gotConversation.messages });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
