import Category from '../models/Category.js';

//CREATE NEW CATEGORY

export const createCategory = async (req,res) =>{
  const newCat = new Category(req.body);
  try{
    const savedCat = await newCat.save();
    res.status(200).json(savedCat);
  }catch(err){
    res.status(404).json({ message: err.message });
  } 
};

//GET ALL CATEGORIES

export const getCategories = async (req,res) =>{
  try{
    const cats = await Category.find();
    res.status(200).json(cats);
  }catch(err){
    res.status(404).json({ message: err.message });
  } 
};