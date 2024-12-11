import express from "express";
import morgan from "morgan";
import cors from "cors";
import appRoutes from "./routes/index.js";

const app = express();

app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(express.json({ limit: "100kb" }));
app.use(cors());
app.use(morgan("dev"));

appRoutes(app);

export default app;
