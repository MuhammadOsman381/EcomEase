import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
  cartItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

export const Cart = mongoose.model("Cart", cartSchema);
