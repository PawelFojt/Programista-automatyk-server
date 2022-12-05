import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { unlink } from 'node:fs/promises';
import { __dirname } from '../index.js';

//UPDATE USER

export const updateUser = async (req,res) => {
  try {
    const user = await User.findById(req.params.id);
    if(req.body.userId === req.params.id) {
      if(req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
     
      try{
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id, 
          {$set: req.body}, 
          {new:true});
          
          res.status(200).json(updatedUser);
          user.profilePic ? await unlink(__dirname + "/images/" + user.profilePic) : null;
        } catch(err){
          res.status(404).json(err);
          console.log(err);
        }
      } else {
        res.status(401).json("Możesz aktualizować tylko swoje konto!");
      }
    } catch(err) {
      console.log(err);
    }
};
 
//DELETE USER

export const deleteUser = async (req,res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log(user.id);
    console.log(req.params.id);
    if(user.id === req.params.id) {
      try{
        await User.findByIdAndDelete(req.params.id);
        user.profilePic ? await unlink(__dirname + "/images/" + user.profilePic) : null;
        res.status(200).json("Usunięto pomyślnie...");
      } catch(err){
        res.status(404).json(err);
      }
    } else {
      res.status(401).json("Możesz usunąć tylko swoje konto!");
    }
  } catch(err) {
    console.log(err);
  }
};

//GET USER
export const getUser = async (req,res)=>{
  try{
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  }catch(err){
    res.status(500).json(err)
  }
};