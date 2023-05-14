import express from "express";
import { createCategory, getCategories } from "../controllers/categories.js";
import { rateLimiterPerIp } from "../middleware/rateLimit.js";

const router = express.Router();

router.route("/")
    .post(rateLimiterPerIp, createCategory)
    .get(getCategories);

export default router;
