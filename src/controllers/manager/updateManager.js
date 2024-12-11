import Manager from "../../models/managerSchema.js";

const updateManagerData = async (req, res) => {
  try {
    const { id, name, email, number } = req.body;

    if (!id) {
      throw new Error("Missing required parameter: id");
    }

    const managerToUpdate = await Manager.findById(id);
    if (!managerToUpdate) {
      throw new Error("Manager not found with the given ID.");
    }

    const updates = { name, email, number };
    for (const field in updates) {
      if (updates[field] !== undefined) {
        managerToUpdate[field] = updates[field];
      }
    }

    await managerToUpdate.save();

    res.status(200).json({
      success: true,
      message: "Manager data updated successfully!",
      data: managerToUpdate,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default updateManagerData;
