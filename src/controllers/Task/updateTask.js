import Task from "../../models/taskSchema.js";

const updateTaskData = async (req, res) => {
  try {
    const { id, title, description, dueDate, priority, status } = req.body;

    if (!id) {
      throw new Error("Missing required parameter: id");
    }

    if (!title && !description && !dueDate && !priority && !status) {
      throw new Error("At least one field is required to update.");
    }

    const taskData = await Task.findById(id);

    if (!taskData) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, dueDate, priority, status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully!",
      data: updatedTask,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default updateTaskData;
