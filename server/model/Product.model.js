import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  price: {
    type: String,
  },
  image: {
    type: String,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  description: {
    type: String,
  },
  cartID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  historyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "History",
  },
});

export const Product = mongoose.model("Product", productSchema);
