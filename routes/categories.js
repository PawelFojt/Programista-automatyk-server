import express from 'express';
import { createCategory, getCategories } from '../controllers/categories.js';

const router = express.Router();

router.post("/", createCategory);

//ALL CATEGORIES
router.get("/", getCategories);

export default router;