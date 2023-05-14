import express from "express";
import { deleteUser, getUser, updateUser } from "../controllers/users.js";
import { rateLimiterPerIp } from "../middleware/rateLimit.js";

const router = express.Router();

router.route("/:id")
    .put(rateLimiterPerIp, updateUser)
    .delete(deleteUser)
    .get(getUser);

export default router;
