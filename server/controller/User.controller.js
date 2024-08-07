import { User } from "../model/User.model.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/tokenGenerator.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import fs from "fs";
import { Cart } from "../model/Cart.model.js";
import { Product } from "../model/Product.model.js";
// import folder from "../middleware/uploads"
import { History } from "../model/History.model.js";

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    const { email, password } = req.body;
    console.log(email, password)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "invalid email",
      });
    }

    const decryptedPassword = await bcrypt.compare(password, user.password);
    if (!decryptedPassword) {
      return res.status(404).json({
        success: false,
        message: "invalid password",
      });
    }
    const token = createToken(user);

    return res.status(200).json({
      success: true,
      message: `welcome back ${user.name}`,
      user: user,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const { name, email, password } = req.body;
    console.log(name, email, password)
    const imagePath = req.file.originalname;
    const nameParts = name.toLowerCase().split(" ");
    const modifiedName = nameParts
      .map((part) => {
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join(" ");

    const isUserExist = await User.findOne({ email: email });
    if (isUserExist) {
      return res.status(404).json({
        success: false,
        message: "This email address is already taken!",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name: modifiedName,
      email: email,
      password: hashedPassword,
      image: imagePath,
    });
    const token = createToken(newUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: token,
      user: newUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      user: req.user,
      message: "logged out successfully",
    });
};

const getUserProfile = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(401).json({ message: "Access token is missing" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decodedToken });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User found successfully",
      user: user,
      image: `https://ecomease-oaar.onrender.com/profilepic/${user.image}`,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    if (user.cart) {
      const userCart = await Cart.findOne({ _id: user.cart });
      await Product.deleteMany({ cartID: user.cart });
      await userCart.deleteOne();
    }

    if (user.history) {
      const userHistory = await History.findOne({ _id: user.history });
      await Product.deleteMany({ historyID: user.history });
      await userHistory.deleteOne();
    }

    await user.deleteOne();
    return res.status(201).json({
      success: true,
      message: "Account deleted succesfully!",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { register };
export { login };
export { logout };
export { getUserProfile };
export { deleteAccount };
