import express from 'express';

import { loginAuth, registerAuth } from '../controllers/auth.js';

const router = express.Router();

//REGISTER
router.post("/register", registerAuth);

//LOGIN
router.post("/login", loginAuth);

export default router;