import { Router } from "express";
import { authController as auth } from "./auth.controller";
import { authCheck } from "../../middleware/authentication/jwt-token";

const router = Router();

router.route('/signup').post(auth.signup);

router.route('/signin').post(auth.signin);

router.route('/verifyOtp').post(auth.verifyOtp);
router.route('/resendOtp').post(auth.resendOtp);

router.route('/forgotPassword').post(auth.forgotPassword);
router.route('/setPassword/:id/:code').post(auth.setPassword);
router.route('/updatePassword').post( auth.updatePassword);

router.route('/auth-test').post(authCheck('USER'),auth.test);

router.route('/').get(auth.getdata);

export default router;