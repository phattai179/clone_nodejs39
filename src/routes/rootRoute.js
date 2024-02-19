import express from "express";
import videoRoute from "./videoRoute.js";

const rootRoute = express.Router();
rootRoute.use("/video", videoRoute);

export default rootRoute;
