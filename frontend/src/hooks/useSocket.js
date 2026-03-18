import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

export const useSocket = (userId) => {
    // const [onlineUsers, setOnlineUsers] = useState({});
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Initialize socket only once
        socket = io("http://localhost:5000");

        // Join with userId
        if (userId) {
            socket.emit("join", userId);
        }

        // Listen for incoming messages
        socket.on("receive_message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        // Cleanup on unmount
        return () => {
            socket.disconnect();
        };
    }, [userId]);

    // Send message function
    const sendMessage = ({ senderId, receiverId, message }) => {
        if (socket && message.trim() !== "") {
            socket.emit("send_message", { senderId, receiverId, message });
            setMessages((prev) => [...prev, { senderId, receiverId, message }]);
        }
    };

    return { messages, sendMessage, socket };
};