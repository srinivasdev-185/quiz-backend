import express from 'express';
import { register,login ,refresh ,logOut } from '../controllers/auth.controller.js';
import { getAdminRequists } from '../controllers/auth.controller.js';
import { approveAdmin,rejectAdmin } from '../controllers/auth.controller.js';
const router=express.Router();

router.post('/register',register);
router.post('/login',login);
router.post('/refresh',refresh);
router.post('/logout',logOut);
router.get('/adminRequists',getAdminRequists);
router.put('/approveAdmin/:id',approveAdmin);
router.put('/rejectAdmin/:id',rejectAdmin);
export default router;