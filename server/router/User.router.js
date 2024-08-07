import express from "express";
import { body } from "express-validator";
import { upload } from "../middleware/multer.middleware.js";
import { deleteAccount, getUserProfile, login, logout, register } from "../controller/User.controller.js";

const userRouter = express.Router();
userRouter.post(
  "/register",
  upload,
  register
);
userRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email Address is required"),
    body("password").isLength({ min: 4 }).withMessage("Password is required"),
  ],
  login
);
userRouter.get("/profile",getUserProfile)
userRouter.post("/logout", logout);
userRouter.route("/delete/:id").delete(deleteAccount)

export { userRouter };
