import { useEffect, useState } from "react";
import API from "../services/api";

export default function Sidebar({ setReceiverId, currentUserId }) {
    const [users, setUsers] = useState([]);

    // Load all users except current logged-in user
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const { data } = await API.get("/users/all"); // Make sure your backend has GET /users
                console.log(data);
                const filteredUsers = data.data.filter(user => user._id !== currentUserId);
                setUsers(filteredUsers);
            } catch (err) {
                console.error("Failed to load users:", err);
            }
        };

        loadUsers();
    }, [currentUserId]);

    return (
        <div className="w-64 border-r border-gray-300 h-screen p-4 bg-gray-50">
            <h2 className="text-xl font-semibold mb-4 text-center">Users</h2>
            <ul>
                {users.map(user => (
                    <li
                        key={user._id}
                        className="flex items-center p-2 mb-2 cursor-pointer hover:bg-blue-100 rounded"
                        onClick={() => setReceiverId(user._id)}
                    >
                        <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                        <span className="text-gray-800 font-medium">{user.username}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}