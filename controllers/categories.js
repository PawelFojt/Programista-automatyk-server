import Category from "../models/Category.js";


export const createCategory = async (req, res) => {
    const newCat = new Category(req.body);
    try {
        const savedCat = await newCat.save();
        res.status(200).json(savedCat);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getCategories = async (req, res) => {
    try {
        const cats = await Category.find();
        res.status(200).json(cats);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
