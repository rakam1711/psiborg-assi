import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const { DB_URI } = process.env;

if (!DB_URI) {
  console.error("DB_URI is not defined in the environment variables");
  process.exit(1);
}

const connectToDatabase = async () => {
  console.log(`Connecting to database...`);
  mongoose.connection
    .on("error", (err) =>
      console.log("Database connection error:", err.message)
    )
    .on("open", () => console.log("Database connection is open."))
    .on("connected", () => console.log("Database connection established."))
    .on("disconnected", () => console.log("Database disconnected."));

  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(resolve)
      .catch((err) => {
        console.log("Unable to connect to the database:", err.message);
        mongoose.connection.close(); // also emits disconnected
        reject(err);
      });
  });
};

export { connectToDatabase };
