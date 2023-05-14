import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.refreshToken) return res.sendStatus(401);
        const refreshToken = cookies.refreshToken;
        const existingUser = await User.findOne({ refreshToken }).exec();

        if (!existingUser) return res.sendStatus(403);
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || existingUser.username !== decoded.username)
                    return res.sendStatus(403);
                const accessToken = jwt.sign(
                    {
                        username: decoded.username,
                        id: decoded._id,
                        email: decoded.email,
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "30s" }
                );
                res.json({ accessToken });
            }
        );
    } catch (error) {
        console.log(error);
    }
};
