import React from "react";

export default function Message({ message, isOwn }) {
    return (
        <div
            className={`mb-2 flex ${isOwn ? "justify-end" : "justify-start"}`}
        >
            <span
                className={`px-3 py-1 rounded-lg max-w-xs break-words ${isOwn ? "bg-green-200 text-gray-800" : "bg-gray-200 text-gray-900"
                    }`}
            >
                {message}
            </span>
        </div>
    );
}