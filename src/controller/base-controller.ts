import express from 'express';
import { generateStructuredOutput } from '../util/open-ai';
import { AssemblyAI } from 'assemblyai';
import { buildFlightsUrl } from '../util/url-builder';
import { validateFlightsSchema } from '../util/validator';

const assemblyAiClient = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY ?? '' });

export const getSearchCriteria = async (req: express.Request, res: express.Response) => {
  try {
    const { text } = req.body;

    const resp = await generateStructuredOutput(text);
    const validatedResp = resp && validateFlightsSchema(resp);

    const {success, schema, error} = validatedResp ?? {};
    const results = success ? buildFlightsUrl(schema) : null;

    res.status(200).json({ success, results, error}).end();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const getToken =  async (_: express.Request, res: express.Response) => {
  try {
    const token = await assemblyAiClient.realtime.createTemporaryToken({ expires_in: 86400 });
    res.cookie('AUTH-TOKEN', token); // TODO: consume in FE
    res.status(200).json({ token }).end();
  } catch (error: any) {
    console.log(error);
    res.status(400);
  }
};