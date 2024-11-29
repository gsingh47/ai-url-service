import express from "express";
import baseRouter from './base-router';

const router = express.Router();

export default (): express.Router => {
  baseRouter(router);
  return router;
};