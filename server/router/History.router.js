import express from "express";
import { getHistoryProduct } from "../controller/History.controller.js";

const historyRouter = express.Router();

historyRouter.get("/get-product", getHistoryProduct);

export { historyRouter };
