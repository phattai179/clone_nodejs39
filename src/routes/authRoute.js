import express from "express";
import {
  login,
  loginFacebook,
  resetToken,
  singUp,
  checkEmail,
  checkCode,
} from "../controllers/authController.js";
import sequelize from "../models/connect.js";
const model = initModels(sequelize);

const authRoute = express.Router();

// login
authRoute.post("/login", login);

// signup
authRoute.post("/signup", singUp);

// loginFacebook
authRoute.post("/login-facebook", loginFacebook);

// Check email
authRoute.post("/check-email/:email", checkEmail);

// Check code
authRoute.post("/check-code/:code", checkCode);

// Đổi mật khẩu
// Email, mật khẩu mới từ client

// Refresh token
authRoute.post("/reset-token", resetToken);

// __dirname // trả về đường dẫn file đang đứng
// process.cwd // trả về đường dẫn gốc

// yarn add multer
import multer from "multer";
import fs from "fs"; // file system
import compress_images from "compress-images";
import { dataToken } from "../config/jwt.js";
import initModels from "../models/init-models.js";

let storage = multer.diskStorage({
  destination: process.cwd() + "/public/img",
  filename: (req, file, callback) => {
    let newName = new Date().getTime() + "_" + file.originalname;
    callback(null, newName); // Đổi tên file
  },
});
let upload = multer({
  storage,
});

authRoute.post("/upload-avatar", upload.single("file"), async (req, res) => {
  let { file } = req;
  console.log("file", file);

  let { token } = req.headers;
  let decode = dataToken(token);
  let checkUser = await model.users.findOne({
    where: {
      user_id: decode.userId,
    },
  });

  if (checkUser) {
    // Lưu vào table -> chỉ lưu file name
    checkUser.dataValues.avatar = file.filename;
    await model.users.update(checkUser.dataValues, {
      where: {
        user_id: checkUser.dataValues.user_id,
      },
    });
  }

  await compress_images(
    process.cwd() + "/public/img/" + file.filename,
    process.cwd() + "/public/file/",
    { compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: "mozjpeg", command: ["-quality", "1"] } },
    { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    {
      gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
    },
    function (error, completed, statistic) {
      console.log("-------------");
      console.log(error);
      console.log(completed);
      console.log(statistic);
      console.log("-------------");
    }
  );

  fs.readFile(process.cwd() + "/public/img/" + file.filename, (err, data) => {
    let nameImg =
      `data:${file.mimetype};base64,` + Buffer.from(data).toString("base64");

    // fs.unlink((process.cwd() + "/public/img/" + file.filename), (err) => {
    //   if (err) {
    //     console.error('Đã xảy ra lỗi khi xóa file:', err);
    //   } else {
    //     console.log('File đã được xóa thành công!');
    //   }
    // })
    res.send(nameImg);
  });
});

export default authRoute;
