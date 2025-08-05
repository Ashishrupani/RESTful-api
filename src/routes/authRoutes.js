import express from "express";
import { signup , login, signout, verifyEmail} from "../controllers/authController.js";

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/signout', signout);

router.post('/verify-email', verifyEmail);



export default router;