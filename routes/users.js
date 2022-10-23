import express from 'express';
import { deleteUser, getUser, updateUser } from '../controllers/users.js';

const router = express.Router();

//UPDATE USER
router.put("/:id", updateUser);

//DELETE USER
router.delete("/:id", deleteUser);

//GET USER
router.get("/:id", getUser);

export default router