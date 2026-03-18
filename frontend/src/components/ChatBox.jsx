import { useState, useEffect, useRef } from "react";
import { socket } from "../utils/socket";
import API from '../services/api';

export default function ChatBox({ receiverId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    // const userId = localStorage.getItem("userId");
    // const user = localStorage.getItem("user");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.id;
    // console.log("userId :", userId);
    // console.log("user :", user);
    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

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

    useEffect(() => {
        socket.on("receive_message", (msg) => {
            if (msg.senderId === receiverId || msg.senderId === userId) {
                setMessages((prev) => [...prev, msg]);
                scrollToBottom();
            }
        });

        return () => socket.off("receive_message");
    }, [receiverId, userId]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        const messageData = {
            senderId: userId,
            receiverId,
            message: newMessage.trim(),
        };

        try {
            await API.post(`/messages/send/${receiverId}`, { message: newMessage.trim() });
            socket.emit("send_message", messageData);
            setMessages((prev) => [...prev, messageData]);
            setNewMessage("");
            scrollToBottom();
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-5 border border-gray-300 rounded-lg shadow-lg p-4 flex flex-col">
            <h3 className="text-xl font-semibold mb-3 text-center">Chat</h3>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto mb-3 h-80 p-2 bg-gray-50 rounded-lg">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-2 flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
                    >
                        <span
                            className={`px-3 py-1 rounded-lg max-w-xs break-words ${msg.senderId === userId ? "bg-green-200" : "bg-gray-200"
                                }`}
                        >
                            {msg.message}
                        </span>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            {/* Input Box */}
            <div className="flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
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