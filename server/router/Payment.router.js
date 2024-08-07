import express from "express";
import { handlePayment } from "../controller/Payment.controller.js";


const paymentRouter = express.Router();
paymentRouter.post(
  "/create-payment-intent",
  handlePayment
);


export { paymentRouter };
