import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { responseApi } from "../config/response.js";
import bcrypt from "bcrypt";
import {
  checkTokenRef,
  createToken,
  createTokenRef,
  dataToken,
} from "../config/jwt.js";

import nodemailder from "nodemailer";

const model = initModels(sequelize);

// Login
const login = async (req, res) => {
  let { email, password } = req.body;

  let checkEmail = await model.users.findOne({
    where: {
      email: email,
    },
  });

  if (checkEmail) {
    // check password
    console.log("password", password);
    console.log("pass_word", checkEmail.pass_word);
    if (bcrypt.compareSync(password, checkEmail.pass_word)) {
      // Chuỗi mã hóa chứa thông tin user
      let key = new Date().getTime();
      let token = createToken({ userId: checkEmail.dataValues.user_id, key });

      let tokenRef = createTokenRef({
        userId: checkEmail.dataValues.user_id,
        key,
      });

      checkEmail.dataValues.refresh_token = tokenRef;

      await model.users.update(checkEmail.dataValues, {
        where: {
          user_id: checkEmail.dataValues.user_id,
        },
      });

      responseApi(res, 200, token, "Login thanh cong");
    } else {
      responseApi(res, 400, "", "Mat khau khong dung");
    }
  } else {
    responseApi(res, 400, "", "Email khong dung");
  }
};

// SignUp
const singUp = async (req, res) => {
  //
  try {
    let { fullName, email, password } = req.body;
    let newUser = {
      full_name: fullName,
      email,
      pass_word: bcrypt.hashSync(password, 10),
      avatar: "",
      face_app_id: "",
      role: "USER",
    };

    let checkEmail = await model.users.findOne({
      where: {
        email: email,
      },
    });

    if (checkEmail) {
      responseApi(res, 400, "", "Email da ton tai");
      return;
    }

    await model.users.create(newUser);
    responseApi(res, 200, "", "Dang ky thanh cong");
  } catch (error) {}
};

// Login facebook
const loginFacebook = async (req, res) => {
  try {
    let { faceAppId, name, email } = req.body;
    let checkUser = await model.users.findOne({
      where: {
        face_app_id: faceAppId,
      },
    });

    let token = "";
    if (checkUser) {
      // Đã login facebook trước đó
      token = createToken({ userId: checkUser.dataValues.user_id });
      responseApi(res, 200, token, "Login thành công");
      return;
    } else {
      let newUser = {
        full_name: name,
        email,
        avatar: "",
        face_app_id: faceAppId,
        role: "USER",
      };

      // Email không trùng
      let checkEmail = await model.users.findOne({
        where: {
          email: email,
        },
      });

      if (checkEmail) {
        responseApi(res, 400, "", "Email đã tồn tại");
        return;
      }
      let data = await model.users.create(newUser);
      token = createToken({ userId: data.dataValues.user_id });
    }
    responseApi(res, 200, token, "Đăng ký thành công");
  } catch (error) {}
};

// Check email
const checkEmail = async (req, res) => {
  // Find data email, password
  let { email } = req.params;

  let checkEmail = await model.users.findOne({
    where: {
      email: email,
    },
  });

  if (checkEmail) {
    // Tạo code
    let code = new Date().getTime();
    let newCode = {
      code,
      exprired: new Date(),
    };

    await model.code.create(newCode);

    // yarn add nodemailer
    let transfor = nodemailder.createTransport({
      auth: {
        user: "dophattai9797@gmail.com",
        pass: "phlk ysmk feox dlzy",
      },
      service: "gmail",
    });

    let sendOption = {
      from: "dophattai9797@gmail.com",
      to: email,
      subject: "Lấy lại mật khẩu",
      text: "Code: " + code,
    };

    transfor.sendMail(sendOption, (error, info) => {});
    responseApi(res, 200, true, "Email tồn tại");
  } else {
    responseApi(res, 200, false, "Email không đúng");
  }
};

// Check code

const checkCode = async (req, res) => {
  let { code } = req.params;

  let checkCode = await model.code.findOne({
    where: {
      code,
    },
  });

  if (checkCode) {
    // Trả token mới
    responseApi(res, 200, true, "");
  } else {
    responseApi(res, 300, false, "Code không đúng");
  }
};

// reset Token
const resetToken = async (req, res) => {
  let { token } = req.headers;
  let decode = dataToken(token);
  console.log("decode", decode);
  // Check token hợp lẹ
  // let checkToken = checkToken(token)

  // Check user => lấy refresh token

  let checkUser = await model.users.findOne({
    where: {
      user_id: decode.userId,
    },
  });
  console.log("checkUser", checkUser);

  if (checkUser) {
    // Check refresh token hợp lệ
    let checkRefToken = checkTokenRef(checkUser.dataValues.refresh_token);
    let decodeRef = dataToken(checkUser.dataValues.refresh_token);

    if (checkRefToken == null && decode.key === decodeRef.key) {
      let token = createToken({
        userId: checkUser.dataValues.user_id,
        key: decode.key,
      });
      responseApi(res, 200, token, "thành công");
      return;
    }
  }
  responseApi(res, 401, "", "Authorizated");
};

export { login, singUp, loginFacebook, checkEmail, checkCode, resetToken };
