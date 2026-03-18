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

        // ✅ JOIN (user comes online)
        socket.on("join", (userId) => {
            onlineUsers[userId] = socket.id;

            console.log("User joined:", userId);
            console.log("Online Users:", onlineUsers);
        });

        // ✅ SEND MESSAGE
        socket.on("send_message", ({ senderId, receiverId, message }) => {
            const receiverSocket = onlineUsers[receiverId];

            const msgData = {
                senderId,
                receiverId,
                message,
            };

            console.log("Sending message:", msgData);

            // 👉 Send to receiver
            if (receiverSocket) {
                io.to(receiverSocket).emit("receive_message", msgData);
            }

            // 👉 Send back to sender (important for UI sync)
            socket.emit("receive_message", msgData);
        });

        // ✅ DISCONNECT (user goes offline)
        socket.on("disconnect", () => {
            for (const userId in onlineUsers) {
                if (onlineUsers[userId] === socket.id) {
                    delete onlineUsers[userId];
                    console.log("User offline:", userId);
                    break;
                }
            }

            console.log("User disconnected:", socket.id);
            console.log("Online Users:", onlineUsers);
        });
    });
};

export default initSocket;