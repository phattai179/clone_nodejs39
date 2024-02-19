// Quản lý api
import express from "express";
import {
  createVideo,
  getVideo,
  getVideoPage,
  getVideoType,
  getVideoWithtype,
} from "../controllers/videoController.js";

const videoRoute = express.Router();

videoRoute.get("/get-video", getVideo);
videoRoute.post("/create-video", createVideo);
videoRoute.get("/get-video-type", getVideoType);
videoRoute.get("/get-video-with-type/:typeId", getVideoWithtype);
videoRoute.get("/get-video-page/:page/:size", getVideoPage);

export default videoRoute;
