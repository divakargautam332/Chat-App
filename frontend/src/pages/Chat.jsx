import { useContext, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import { AuthContext } from "../context/AuthContext";

export default function Chat() {
    const { user } = useContext(AuthContext);
    const [receiverId, setReceiverId] = useState("");

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-700">
                <p>Please login to access the chat.</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar with users */}
            <Sidebar setReceiverId={setReceiverId} currentUserId={user.id} />
            {console.log("receiverId :", receiverId)}
            {/* Chat area */}
            <div className="flex-1 flex flex-col justify-center items-center bg-gray-100">
                {receiverId ? (
                    <ChatBox receiverId={receiverId} />
                ) : (
                    <p className="text-gray-500 text-lg">
                        Select a user to start chatting
                    </p>
                )}
            </div>
        </div>
    );
}