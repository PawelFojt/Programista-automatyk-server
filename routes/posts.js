import express from 'express';
import { getPosts, getPost, deletePost, updatePost, createPost } from '../controllers/posts.js';

const router = express.Router();

//GET ALL POSTS
router.get("/", getPosts);

//CREATE POST
router.post("/", createPost);

//UPDETE POST
router.patch("/:id", updatePost);

//DETELE POST
router.delete("/:id", deletePost);

//GET POST
router.get("/:id", getPost);

export default router;