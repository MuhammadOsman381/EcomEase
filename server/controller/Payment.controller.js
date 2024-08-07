import Stripe from "stripe";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { User } from "../model/User.model.js";
import jwt from "jsonwebtoken";
import { Cart } from "../model/Cart.model.js";
import { History } from "../model/History.model.js";
import { Product } from "../model/Product.model.js";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const handlePayment = async (req, res) => {
  try {
    const { amount, currency, email, name } = req.body;

    // Validate the amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const amountInCents = Math.round(amount * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
    });

    const emailSubject = "Payment Deduction Notification";
    const emailText = `${name} your payment of $${(amountInCents / 100).toFixed(
      2
    )} has been successfully processed. Payment Intent ID: ${paymentIntent.id}`;
    await sendEmail(email, emailSubject, emailText);

    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(401).json({ message: "Access token is missing" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userCart = await Cart.findById(user.cart);
    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    let newHistory = user.history
      ? await History.findById(user.history)
      : new History({ historyItems: [] });

    userCart?.cartItems?.forEach((item) => {
      newHistory?.historyItems?.push(item);
    });

    await newHistory.save();

    let products;
    userCart?.cartItems?.forEach(async (item) => {
      products = await Product.findOne({ _id: item });
      products.cartID = null;
      products.historyID = newHistory._id;
      await products.save();
    });

    user.history = newHistory._id;
    user.cart = null;
    await user.save();
    await userCart.deleteOne();

    return res.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { handlePayment };
