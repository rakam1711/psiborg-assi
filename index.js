import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectToDatabase } from "./config/dbConnection/connection.js";
import app from "./src/app.js";
import scripts from "./src/scripts/index.js";
dotenv.config();

const { PORT, BASE_URL } = process.env;

(async () => {
  try {
    console.log("Initializing server");
    await connectToDatabase();
    await scripts();
    app
      .listen(PORT, () => console.log(`Server is running on ${BASE_URL}`))
      .on("error", shutdown);
  } catch (error) {
    shutdown(error);
  }
})();

async function shutdown(err) {
  console.log("Unable to initialize the server:", err.message);
  await mongoose.connection.close();
  process.exit(1);
}
