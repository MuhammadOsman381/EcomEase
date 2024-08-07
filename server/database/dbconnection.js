import mongoose from "mongoose";

export default async function dbconnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`database connected`);
  } catch (error) {
    console.log("connection failed");
    throw error;
  }
}
