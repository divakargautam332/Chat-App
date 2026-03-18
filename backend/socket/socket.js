import { Server } from "socket.io";

const onlineUsers = {};

const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        // User joins with their userId
        socket.on("join", (userId) => {
            onlineUsers[userId] = socket.id;
            console.log("Online Users:", onlineUsers);
            console.log("user id", userId);
        });

        // Send message to a specific user
        socket.on("send_message", ({ senderId, receiverId, message }) => {
            const receiverSocket = onlineUsers[receiverId];

            if (receiverSocket) {
                io.to(receiverSocket).emit("receive_message", {
                    senderId,
                    message,
                });
            }
        });

        // When user disconnects
        socket.on("disconnect", () => {
            for (const userId in onlineUsers) {
                if (onlineUsers[userId] === socket.id) {
                    delete onlineUsers[userId];
                }
            }
            console.log("User disconnected:", socket.id);
        });

    });
};

export default initSocket;
