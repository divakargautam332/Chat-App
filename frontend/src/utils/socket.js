import { io } from "socket.io-client";

// Initialize socket connection
export const socket = io("http://localhost:5000", {
    transports: ["websocket"], // Ensure WebSocket transport
    autoConnect: true,
});