import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import http from "http";

import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import initSocket from "./socket/socket.js";


const app = express();
const server = http.createServer(app);

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// Error Middleware
app.use(errorMiddleware);

// Initialize Socket
initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
