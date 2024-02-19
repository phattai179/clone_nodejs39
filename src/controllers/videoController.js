// import connection from "../models/connect.js";
import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op } from "sequelize";
import { responseApi } from "../config/response.js";

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

export { getVideo, createVideo, getVideoType, getVideoWithtype, getVideoPage };
