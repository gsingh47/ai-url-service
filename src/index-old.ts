import express, { Request, Response } from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import { AssemblyAI } from 'assemblyai'
import { completions } from './util/open-ai';
import './config/config';
import { SERVER } from "./config/config";

const app = express();

app.use(cors()); // TOOD: enable cors for specific client domain only
app.use(bodyParser.json());

const assemblyAiClient = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY ?? '' });

app.get("/", (req: Request, res: Response) => {
  res.send({status: 200, connection: 'started'});
});

app.get('/token', async (req, res) => {
  try {
    const token = await assemblyAiClient.realtime.createTemporaryToken({ expires_in: 172800 });
    res.json({ token });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
});

app.post('/getSearchCriteria', async (req, res) => {
  try {
    const schema = await completions(req.body.text);
    res.json({ status: 200, success: true, schema});
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
});

app.listen(SERVER.SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER.SERVER_PORT}`);
});