import Manager from "../../models/managerSchema.js";

const saveManagerData = async (req, res) => {
  try {
    const { name, email, number } = req.body;

    const requiredFields = { name, email, number };
    for (const field in requiredFields) {
      if (!requiredFields[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const managerExists = await Manager.findOne({ number });
    if (managerExists) {
      throw new Error("Manager with this number already exists.");
    }

    const newManager = new manager({ name, email, number });
    await newManager.save();

    res.status(201).json({
      success: true,
      message: "Manager data saved successfully!",
      data: newManager,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default saveManagerData;
