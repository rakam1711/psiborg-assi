import Task from "../../models/taskSchema.js";

const listTask = async (req, res, next) => {
  try {
    let limit = parseInt(req.body.limit) || 10;
    let page = parseInt(req.body.page) || 1;

    const input = req.body.input || "";

    let pipeline = [];

    if (input.trim() !== "") {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: input, $options: "i" } },
            { description: { $regex: input, $options: "i" } },
            { priority: { $regex: input, $options: "i" } },
            { status: { $regex: input, $options: "i" } },
          ],
        },
      });
    }

    let skip = (page - 1) * limit;
    pipeline.push({ $skip: skip }, { $limit: limit });

    const tasks = await Task.aggregate(pipeline);

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }

    return res.status(200).json({
      status: true,
      message: "Tasks listed successfully",
      data: tasks,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
      location: "src/Modules/Task/controller/listTask",
    });
  }
};

export default listTask;
