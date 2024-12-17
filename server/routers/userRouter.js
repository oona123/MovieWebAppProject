import { Router } from "express";
import { postRegistration, postLogin, getUserInfo, deleteAccount } from "../controllers/UserController.js";
import { auth } from "../helpers/auth.js";

const router = Router();

// Routes for user registration and login
router.post("/register", postRegistration);
router.post("/login", postLogin);
router.get("/profile", auth, getUserInfo)
router.delete("/delete/", auth, deleteAccount)


export default router;
