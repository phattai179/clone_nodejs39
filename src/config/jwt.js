import jwt from "jsonwebtoken";
import { responseApi } from "./response.js";

export const createToken = (data) =>
  jwt.sign(data, "BI_MAT", { algorithm: "HS256", expiresIn: "1d" });

export const createTokenRef = (data) =>
  jwt.sign(data, "BI_MAT_2", { algorithm: "HS256", expiresIn: "7d" });

export const checkToken = (token) =>
  jwt.verify(token, "BI_MAT", (err, decode) => err);

export const checkTokenRef = (token) =>
  jwt.verify(token, "BI_MAT_2", (err, decode) => err);

// Giải mã token
export const dataToken = (token) => jwt.decode(token);

// export const midVerifyToken = (req, res, next) => {
//   let { token } = req.headers;
//   console.log("token", token);
//   let check = checkToken(token);
//   console.log("check", check);
//   if (check == null) next();
//   else responseApi(res, 401, "", check);
// };

export const midVerifyToken = (req, res, next) => {
  let { token } = req.headers;
  let check = checkToken(token);
  console.log("check", check);
  if (check == null) next();
  else responseApi(res, 401, "", check);
};
