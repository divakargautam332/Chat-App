import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// Register User
export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });
        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Login User
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Generate token
        const token = generateToken(user._id);
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};


export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
};
