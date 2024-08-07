import mongoose from "mongoose";
const historySchema = new mongoose.Schema({
  historyItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

export const History = mongoose.model("History", historySchema);
