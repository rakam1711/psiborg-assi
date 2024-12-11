import Manager from "../../models/managerSchema.js";
const deleteManager = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      throw new Error("Missing required parameter: id");
    }

    const managerData = await Manager.findById(id);

    res.status(200).json({
      success: true,
      message: "Manager deleted successfully!",
      data: managerData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default deleteManager;
