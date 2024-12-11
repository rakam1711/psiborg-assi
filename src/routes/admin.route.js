import express from "express";
import saveTaskData from "../controllers/Task/createTask.js";
import deleteTaskData from "../controllers/Task/deleteTask.js";
import listTask from "../controllers/Task/listTask.js";
import updateTaskData from "../controllers/Task/updateTask.js";
import adminAuthorization from "../middlewares/JWT/adminAuthentication.js";
const adminRoutes = express.Router();

adminRoutes.post("/createtask", adminAuthorization, saveTaskData);
adminRoutes.post("/deleteTask", adminAuthorization, deleteTaskData);
adminRoutes.post("/updateTask", adminAuthorization, updateTaskData);
adminRoutes.post("/listTask", listTask);

export default adminRoutes;
