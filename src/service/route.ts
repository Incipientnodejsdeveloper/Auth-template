import { Router } from "express";
const router = Router();
import Auth from './auth/auth.route';

router.use("/auth", Auth);

export default router;