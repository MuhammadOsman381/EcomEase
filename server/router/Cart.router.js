import express from "express";
import { createProduct, getProduct, incrementOrDecrement, removeItem } from "../controller/Product.controller.js";

const productRouter = express.Router();
productRouter.post(
  "/create-product",
  createProduct
);

productRouter.get("/get-product",getProduct)
productRouter.post("/inc-dec",incrementOrDecrement)
productRouter.post("/remove",removeItem)

export { productRouter };
