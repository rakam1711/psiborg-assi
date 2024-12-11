import express from "express";
import userRoute from "./user.route.js";
import adminRoutes from "./admin.route.js";
import managerRoutes from "./manager.route.js";
// import adminRoute from "./admin.route.js";

const appRoutes = (app) => {
  app.get("/api/ping", (_, res) =>
    res.status(200).json({
      status: true,
      message: "Ping Successfully.",
      timestamp: new Date(),
    })
  );

  app.use("/api", userRoute);
  app.use("/admin", adminRoutes);
  app.use("/manager", managerRoutes);
  // app.use("/admin", adminRoute);
};

export default appRoutes;
