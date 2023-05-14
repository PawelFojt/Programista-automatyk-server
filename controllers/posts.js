import Post from "../models/Post.js";
import { __dirname } from "../server.js";
import { deleteFromGCS } from "../GCS api/deleteFromGCS.js";

//GET POSTS
export const getPosts = async (req, res) => {
    const username = req.query.user;
    const categoryName = req.query.cat;
    try {
        let posts;
        if (username) {
            posts = await Post.find({ username });
        } else if (categoryName) {
            posts = await Post.find({
                categories: {
                    $in: [categoryName],
                },
            });
        } else {
            posts = await Post.find();
        }

        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json(error);
    }
};

//GET POST
export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
};

//CREATE POST
export const createPost = async (req, res) => {
    try {
        const newPost = await Post.create(req.body);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json(error);
    }
};

//UPDATE POST
export const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: req.body,
                    },
                    { new: true }
                );
                post.photo && deleteFromGCS(post.photo);
                res.status(200).json(updatedPost);
            } catch (error) {
                res.status(404).json(error);
            }
        } else {
            res.status(401).json({
                msg: "Możesz aktualizować tylko swoje posty!",
            });
        }
    } catch (error) {
        res.status(404).json(error);
    }
};

//DELETE POST
export const deletePost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (post.username === req.username) {
        try {
            const post = await Post.findById(req.params.id);
            post.photo && deleteFromGCS(post.photo);
            await post.delete();
            res.status(200).json("Post został usunięty!");
        } catch (error) {
            res.status(404).json(error);
        }
    } else {
        res.status(401).json({ msg: "Możesz usuwać tylko swoje posty!" });
    }
};
