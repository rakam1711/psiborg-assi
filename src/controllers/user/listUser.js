import User from "../../models/user.js";

const listUser = async (req, res, next) => {
  try {
    let limit = parseInt(req.body.limit) || 10;
    let page = parseInt(req.body.page) || 1;

    const input = req.body.input || "";

    let pipeline = [];

    if (input.trim() !== "") {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: input, $options: "i" } },
            { email: { $regex: input, $options: "i" } },
            { number: { $regex: input, $options: "i" } },
            { gender: { $regex: input, $options: "i" } },
          ],
        },
      });
    }

    let skip = (page - 1) * limit;

    pipeline.push({ $skip: skip }, { $limit: limit });

    const user = await User.aggregate(pipeline);

    if (user.length === 0) {
      return res.status(404).json({ message: "No user found" });
    }

    return res.status(200).json({
      status: true,
      message: "User listed successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
      location: "src/Modules/User/controller/listUser",
    });
  }
};

export default listUser;
