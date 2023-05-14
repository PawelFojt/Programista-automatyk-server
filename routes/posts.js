import express from "express";
import {
  getPosts,
  getPost,
  deletePost,
  updatePost,
  createPost,
} from "../controllers/posts.js";
import verifyToken from "../middleware/verifyToken.js";
import { rateLimiterPerIp } from "../middleware/rateLimit.js";

const router = express.Router();

router.route("/")
  .get(getPosts)
  .post(verifyToken, rateLimiterPerIp, createPost);

router.route("/:id")
  .get(getPost)
  .patch(verifyToken, rateLimiterPerIp, updatePost)
  .delete(verifyToken, deletePost);

export default router;
