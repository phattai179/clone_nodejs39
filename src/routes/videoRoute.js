// Quản lý api
import express from "express";
import {
  commentVideo,
  createVideo,
  getCommentVideo,
  getVideo,
  getVideoDetail,
  getVideoPage,
  getVideoType,
  getVideoWithtype,
} from "../controllers/videoController.js";
import { midVerifyToken } from "../config/jwt.js";

const videoRoute = express.Router();

videoRoute.get("/get-video", midVerifyToken, getVideo);
videoRoute.post("/create-video", createVideo);
videoRoute.get("/get-video-type", getVideoType);
videoRoute.get("/get-video-with-type/:typeId", getVideoWithtype);
videoRoute.get("/get-video-page/:page", midVerifyToken, getVideoPage);
videoRoute.get("/get-video-detail/:videoId", getVideoDetail);
// api get danh sách comment theo videoId
videoRoute.get("/get-comment-video/:videoId", getCommentVideo);
// api comment
videoRoute.post("/comment-video", commentVideo);

export default videoRoute;
