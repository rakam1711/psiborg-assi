import express from "express";

import listTask from "../controllers/Task/listTask.js";
import updateTaskData from "../controllers/Task/updateTask.js";
import managerAuthentication from "../middlewares/JWT/managerAuthentication.js";
const managerRoutes = express.Router();

managerRoutes.post("/updateTask", managerAuthentication, listTask);
managerRoutes.post("/listTask", managerAuthentication, updateTaskData);

export default managerRoutes;
