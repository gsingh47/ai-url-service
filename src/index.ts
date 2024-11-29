import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import './config/config';
import { SERVER } from "./config/config";
import router from "./router";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/', router());

app.listen(SERVER.SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER.SERVER_PORT}`);
});