import express from "express";
import cors from "cors";
import { userRouter } from "./router/User.router.js";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path, { dirname, join } from "path";
import { productRouter } from "./router/Cart.router.js";
import { paymentRouter } from "./router/Payment.router.js";
import { historyRouter } from "./router/History.router.js";

// Initialize express app
const app = express();

const __dirserver = path.resolve();
console.log(__dirserver);

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up CORS options
const corsOptions = {
  origin: "https://ecomease-oaar.onrender.com/",
  credentials: true,
};

// Use CORS middleware with options
app.use(cors(corsOptions));

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files
app.use(
  "/profilepic",
  express.static(path.join(__dirname, "middleware", "uploads"))
);

// JSON middleware
app.use(express.json());

// Routers
app.use("/api/user", userRouter);
app.use("/api/cart", productRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/history", historyRouter);

app.use(express.static(path.join(__dirserver, "/ecommerce-frontend/dist")));
app.get("*", (req, res) => {
  res.send(
    path.resolve(__dirserver, "ecommerce-frontend", "dist", "index.html")
  );
});

export { app };
