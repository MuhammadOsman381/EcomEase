import { User } from "../model/User.model.js";
import jwt from "jsonwebtoken";
import { Product } from "../model/Product.model.js";
import { History } from "../model/History.model.js";

const getHistoryProduct = async (req, res) => {
  try {
    const tempArray = [];

    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(401).json({ message: "Access token is missing" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userHistory = await History.findOne({ _id: user.history });

    if (!userHistory) {
      return res.status(404).json({ message: "User history not found" });
    }
    const products = await Promise.all(
      userHistory.historyItems.map(async (itemId) => {
        return await Product.findById(itemId);
      })
    );

    console.log(products);

    await products.map((product) => {
      if (product) {
        tempArray.push({
          title: product.title,
          image: product.image,
          price: product.price,
          totalPrice: product.price * product.quantity,
          quantity: product.quantity,
        });
      }
    });

    let temp = 0;
    tempArray.map((items) => {
      return (temp = items.totalPrice + temp);
    });

    return res.status(200).json({
      success: true,
      products: tempArray,
      subtotal: temp,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { getHistoryProduct };
