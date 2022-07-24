import express from "express";
import http from "http";
import cors from "cors";

import routes from "./routes";
import { handle404, injectRequestUuid } from "./middlewares";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(injectRequestUuid);

app.use(`/v1`, routes);

app.use(`/*`, handle404);

export { app, server };
