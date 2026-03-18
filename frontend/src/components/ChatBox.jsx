import { useState, useEffect, useRef } from "react";
import { socket } from "../utils/socket";
import API from "../services/api";

export default function ChatBox({ receiverId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // ✅ JOIN SOCKET (VERY IMPORTANT)
    useEffect(() => {
        if (userId) {
            socket.emit("join", userId);
        }
    }, [userId]);

    // ✅ LOAD OLD MESSAGES
    useEffect(() => {
        const loadMessages = async () => {
            if (!receiverId) return;
            try {
                const { data } = await API.get(`/messages/${receiverId}`);
                setMessages(data.data);
                scrollToBottom();
            } catch (err) {
                console.error("Failed to load messages:", err);
            }
        };

        loadMessages();
    }, [receiverId]);

    // ✅ RECEIVE MESSAGE (REAL-TIME)
    useEffect(() => {
        const handleMessage = (msg) => {
            // Only show messages between these two users
            if (
                (msg.senderId === receiverId && msg.receiverId === userId) ||
                (msg.senderId === userId && msg.receiverId === receiverId)
            ) {
                setMessages((prev) => [...prev, msg]);
                scrollToBottom();
            }
        };

        socket.on("receive_message", handleMessage);

        return () => socket.off("receive_message", handleMessage);
    }, [receiverId, userId]);

    // ✅ SEND MESSAGE
    const handleSend = async () => {
        if (!newMessage.trim()) return;

        const messageData = {
            senderId: userId,
            receiverId,
            message: newMessage.trim(),
        };

        try {
            // Save to DB
            await API.post(`/messages/send/${receiverId}`, {
                message: newMessage.trim(),
            });

            // Send via socket
            socket.emit("send_message", messageData);

            // ❌ DO NOT add manually (prevents duplicate)
            // setMessages((prev) => [...prev, messageData]);

            setNewMessage("");
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-5 border border-gray-300 rounded-lg shadow-lg p-4 flex flex-col">
            <h3 className="text-xl font-semibold mb-3 text-center">Chat</h3>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-3 h-80 p-2 bg-gray-50 rounded-lg">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-2 flex ${msg.senderId === userId ? "justify-end" : "justify-start"
                            }`}
                    >
                        <span
                            className={`px-3 py-1 rounded-lg max-w-xs break-words ${msg.senderId === userId
                                    ? "bg-green-200"
                                    : "bg-gray-200"
                                }`}
                        >
                            {msg.message}
                        </span>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            {/* Input */}
            <div className="flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
}