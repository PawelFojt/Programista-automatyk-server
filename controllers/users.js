import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { __dirname } from '../index.js';
import AWS from 'aws-sdk';

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
           //delete profile pic
        const deletePhoto = async () => {
          const s3 = new AWS.S3();
          await s3.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `uploads/${user.profilePic}`
          },function (err,data){
          })
        }
        user.profilePic && deletePhoto();
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
        //delete profile pic
        const deletePhoto = async () => {
          const s3 = new AWS.S3();
          console.log(process.env.AWS_BUCKET_NAME);
          await s3.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `uploads/${user.profilePic}`
          },function (err,data){
          })
        }
        user.profilePic && deletePhoto();
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