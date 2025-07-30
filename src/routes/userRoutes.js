import express from "express";
import { userHit } from "../controllers/userController.js";

const router = express.Router();


router.get('/',userHit);

export default router;