import Post from '../models/Post.js';

export const getPosts = async (req,res)=>{
  const username = req.query.user;
  const categoryName = req.query.cat;
  try{
    let posts;
    if(username){
      posts = await Post.find({username})
    } else if (categoryName){
      posts = await Post.find({categories:{
        $in:[categoryName]
      }}) 
    } else{
      posts = await Post.find();
    }
    res.status(200).json(posts);
  }catch(err){
    res.status(500).json(err)
  }
};

export const getPost = async (req,res)=>{
  try{
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  }catch(err){
    res.status(500).json(err)
  }
};

export const deletePost = async (req,res) => {
  try{
    const post = await Post.findById(req.params.id);
    if(post.username === req.body.username){
      try{
        await post.delete()
        res.status(200).json("Post został usunięty!");
      }catch(err){
        res.status(404).json({ message: err.message });
      }
    }else {
      res.status(401).json("Możesz usuwać tylko swoje posty!")
    }
  } catch(err){
    res.status(404).json({ message: err.message });
  }
};

export const updatePost = async (req,res) => {
  try{
    const post = await Post.findById(req.params.id);
    if(post.username === req.body.username){
      try{
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, 
          {
          $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      }catch(err){
        res.status(404).json({ message: err.message });
      }
    }else {
      res.status(401).json("Możesz aktualizować tylko swoje posty!")
    }
  } catch(err){
    res.status(404).json({ message: err.message });
  }
};

export const createPost = async (req,res) => {
  const newPost = new Post(req.body);
  try{
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  }catch(err){
    res.status(409).json({ message: err.message });
  }
};