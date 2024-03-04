import express from "express";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(".")); // định vị lại đường dẫn
app.listen(8080);

import rootRoute from "./routes/rootRoute.js";
app.use(rootRoute);
