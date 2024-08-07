import { User } from "../model/User.model.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { Product } from "../model/Product.model.js";
import { Cart } from "../model/Cart.model.js";

const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const { proTitle, proImg, proPrice } = req.body;

    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(401).json({ message: "Access token is missing" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let isCartExist = await Cart.findOne({ _id: user.cart });

    if (isCartExist) {
      const isProductAlreadyExist = await Product.findOne({
        _id: { $in: isCartExist.cartItems },
        title: proTitle,
        image: proImg,
        price: proPrice,
      });

      if (isProductAlreadyExist) {
        isProductAlreadyExist.quantity = await (isProductAlreadyExist.quantity +
          1);
        await isProductAlreadyExist.save();
        return res.status(201).json({
          success: true,
          message: "Item added to cart successfully!",
        });
      }
    }

    const product = new Product({
      title: proTitle,
      image: proImg,
      price: proPrice,
    });

    if (!user.cart) {
      const newCart = new Cart({
        cartItems: [product._id],
      });
      product.cartID = newCart._id;
      user.cart = newCart._id;
      await newCart.save();
    } else {
      isCartExist.cartItems.push(product._id);
      product.cartID = isCartExist._id;
      await product.save();
      await isCartExist.save();
    }

    await product.save();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getProduct = async (req, res) => {
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
    const cart = await Cart.findById(user.cart);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const products = await Promise.all(
      cart.cartItems.map(async (itemId) => {
        return await Product.findById(itemId);
      })
    );
    await products.map((product) => {
      if (product) {
        tempArray.push({
          _id: product._id,
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

const incrementOrDecrement = async (req, res) => {
  try {
    const { value, id } = req.body;
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({
        success: true,
        message: "item not found!",
      });
    }
    product.quantity = product.quantity + value;
    product.save();
    return res.status(201).json({
      success: true,
      message: "item updated succesfully!",
    });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const removeItem = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findOne({ _id: id });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Item not found!",
      });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { cartItems: product._id },
      { $pull: { cartItems: product._id } },
      { new: true }
    );
    if (updatedCart) {
      console.log("Updated Cart:", updatedCart);
    } else {
      console.log("Product was not in the cart.");
    }
    await product.deleteOne();
    return res.status(201).json({
      success: true,
      message: "Item removed from cart successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { createProduct, getProduct, incrementOrDecrement, removeItem };
