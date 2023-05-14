import User from "../models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
        await User.create({
            username,
            email,
            password: hashedPassword,
        });
        
        res.status(201).json({
            msg: "Rejestracja pomyślna, możesz się zalogować!",
        });
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username }).exec();
        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({ msg: "Nieprawidłowe hasło!" });
        }
        const accessToken = jwt.sign(
            {
                username: existingUser.username,
                id: existingUser._id,
                email: existingUser.email,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30s" }
        );
        const refreshToken = jwt.sign(
            {
                username: existingUser.username,
                id: existingUser._id,
                email: existingUser.email,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
        });
        await User.findByIdAndUpdate(
            existingUser._id,
            { refreshToken },
            { new: true }
        );

        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({ msg: "Taki użytkownik nie istnieje!" });
    }
};

export const logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(204);
    const refreshToken = cookies.refreshToken;
    const existingUser = await User.findOne({ refreshToken }).exec();
    if (!existingUser) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });
        return res.sendStatus(204);
    }
    await User.findByIdAndUpdate(existingUser._id, { refreshToken: null });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    });
    return res.sendStatus(200);
};
