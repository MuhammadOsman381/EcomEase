import mongoose from "mongoose";

export default async function dbconnection() {
  try {
    const connectionString = process.env.MONGODB_URI;
    if (!connectionString) {
      throw new Error("MongoDB connection string is missing in environment variables");
    }

    const connection = await mongoose.connect(connectionString);

    console.log(`Database connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process with failure
  }
}
