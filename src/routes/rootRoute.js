import express from "express";
import videoRoute from "./videoRoute.js";
import authRoute from "./authRoute.js";

const rootRoute = express.Router();
rootRoute.use("/video", videoRoute);
rootRoute.use("/auth", authRoute);

export default rootRoute;
