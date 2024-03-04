// import connection from "../models/connect.js";
import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op } from "sequelize";
import { responseApi } from "../config/response.js";
import { dataToken } from "../config/jwt.js";

const model = initModels(sequelize);

let getVideo = async (req, res) => {
  let sql = "SELECT * FROM video";

  let data = await model.video.findAll({
    // where: {
    //   video_name: {
    //     [Op.like]: "%gaming%",
    //   },
    // },
    include: ["type", "user"],
  });

  responseApi(res, 200, data, "Thành công");
};

let createVideo = (req, res) => {
  res.send("post video");
};

let getVideoType = async (req, res) => {
  let data = await model.video_type.findAll();
  responseApi(res, 200, data, "Thành Công");
};

let getVideoWithtype = async (req, res) => {
  let { typeId } = req.params;
  let data = await model.video.findAll({
    where: {
      type_id: typeId,
    },
  });
  responseApi(res, 200, data, "Thành Công");
};

let getVideoPage = async (req, res) => {
  console.log("params", req.params);
  let { page } = req.params;
  let size = 3;
  // console.log("page", "size", page, size);
  let countVideo = await model.video.count();
  let totalPage = Math.ceil(countVideo / size);
  let index = (page - 1) * size;

  let data = await model.video.findAll({
    limit: size,
    offset: index,
  });

  responseApi(res, 200, { content: data, totalPage }, "Thành Công");
};

// Get VideoDetail
let getVideoDetail = async (req, res) => {
  let { videoId } = req.params;
  let data = await model.video.findOne({
    where: {
      video_id: videoId,
    },
    include: ["user"],
  });
  responseApi(res, 200, data, "Thành công");
};

// Get commmentVideo
let getCommentVideo = async (req, res) => {
  let { videoId } = req.params;
  let data = await model.video_comment.findAll({
    where: {
      video_id: videoId,
    },
    order: [["date_create", "DESC"]],
    include: ["user"],
  });

  responseApi(res, 200, data, "Thành công");
};

// Post Comment
let commentVideo = async (req, res) => {
  let { videoId, content } = req.body;
  let { token } = req.headers;
  let decode = dataToken(token);
  let { userId } = decode;

  let newComment = {
    video_id: videoId,
    user_id: userId,
    content: content,
    date_create: new Date(),
  };

  await model.video_comment.create(newComment);
  responseApi(res, 200, "", "Thành Công");
};

export {
  getVideo,
  createVideo,
  getVideoType,
  getVideoWithtype,
  getVideoPage,
  getVideoDetail,
  getCommentVideo,
  commentVideo,
};
