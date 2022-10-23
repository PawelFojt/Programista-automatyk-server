import User from '../models/User.js';
import bcrypt from 'bcrypt';

//UPDATE USER

export const updateUser = async (req,res) => {
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
    } catch(err){
      res.status(404).json({ message: err.message });
    }
  } else {
    res.status(401).json("Możesz aktualizować tylko swoje konto!");
  }
};

export const deleteUser = async (req,res) => {
  if(req.body.userId === req.params.id) {
    try{
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Usunięto pomyślnie...");
    } catch(err){
      res.status(404).json({ message: err.message });
    }
  } else {
    res.status(401).json("Możesz usunąć tylko swoje konto!");
  }
};

export const getUser = async (req,res)=>{
  try{
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  }catch(err){
    res.status(500).json(err)
  }
};