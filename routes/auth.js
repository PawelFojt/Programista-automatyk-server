import express from "express";
import { login, logout, register } from "../controllers/auth.js";
import { refreshToken } from "../controllers/refreshToken.js";
import { rateLimiterPerIp } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/register", rateLimiterPerIp, register);
router.post("/login", rateLimiterPerIp, login);
router.get("/token", refreshToken);
router.delete("/logout", logout);

export default router;
