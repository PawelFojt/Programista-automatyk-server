import express from 'express';
import { getPosts, getPost, deletePost, updatePost, createPost } from '../controllers/posts.js';

const router = express.Router();

//CREATE POST
router.post("/", createPost);

//UPDETE POST
router.put("/:id", updatePost);

//DETELE POST
router.delete("/:id", deletePost);

//GET POST
router.get("/:id", getPost);

//GET ALL POSTS
router.get("/", getPosts);

export default router;