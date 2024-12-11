import Task from "../../models/taskSchema.js";

const saveTaskData = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    const requiredFields = { title, description, dueDate, priority, status };
    for (const field in requiredFields) {
      if (!requiredFields[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const newTask = new Task({ title, description, dueDate, priority, status });

    await newTask.save();

    res.status(201).json({
      success: true,
      message: "Task data saved successfully!",
      data: newTask,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default saveTaskData;
