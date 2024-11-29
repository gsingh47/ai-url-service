import express from 'express';
import { completions, generateStructuredOutput } from '../util/open-ai';
import { AssemblyAI } from 'assemblyai';
import { buildFlightsUrl } from '../util/url-builder';
import { validateFlightsSchema } from '../util/validator';

const assemblyAiClient = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY ?? '' });

export const getSearchCriteria = async (req: express.Request, res: express.Response) => {
  try {
    const { site, text } = req.body;
    const resp = await generateStructuredOutput(text);
    const validatedResp = resp && validateFlightsSchema(resp);
    const {success, schema, error} = validatedResp ?? {};
    const mappedResp = success ? buildFlightsUrl(schema) : null;
    res.status(200).json({ success, mappedResp, error}).end();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const getToken =  async (req: express.Request, res: express.Response) => {
  try {
    const token = await assemblyAiClient.realtime.createTemporaryToken({ expires_in: 86400 });
    res.cookie('AUTH-TOKEN', token);
    res.status(200).json({ token }).end();
  } catch (error: any) {
    console.log(error);
    res.status(400);
  }
};