import express from 'express';
import { generateStructuredOutput } from '../util/open-ai';
import { AssemblyAI } from 'assemblyai';
import { buildFlightsUrl } from '../util/url-builder';
import { validateFlightsSchema } from '../util/validator';
import Stripe from 'stripe';
import { FlightsFieldsSchema } from '../schemas/flights';
import { SearchType } from '../util/constants';
import { HotelsFieldsSchema } from '../schemas/hotels';
import { fetchBcomDestinationSuggestions } from '../util/fetch-helper';
import { getMappedDestinations } from '../util/mapper-helper';

const assemblyAiClient = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY ?? '' });
const stripe = new Stripe('dummy-key');

export const getSearchCriteriaFlights = async (req: express.Request, res: express.Response) => {
  try {
    const { searchText } = req.body;

    const resp = await generateStructuredOutput(searchText) as FlightsFieldsSchema | null;
    const validatedResp = resp && validateFlightsSchema(resp);

    const {success, schema, error} = validatedResp ?? {};
    const results = success ? buildFlightsUrl(schema) : null;

    res.status(200).json({ success, results, error}).end();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const getSearchCriteria = async (req: express.Request, res: express.Response) => {
  try {
    const { searchText, site, searchType } = req.body;
    let resp = await generateStructuredOutput(searchText, site, searchType);
    
    if (resp && searchType === SearchType.HOTELS) {
      const hotelsResp = resp as HotelsFieldsSchema;
      const destinationSuggestions = await fetchBcomDestinationSuggestions(hotelsResp.destinationName);
      const mappedDestSuggestions = getMappedDestinations(destinationSuggestions.results); 
      resp = Object.assign({}, hotelsResp, { destinationSuggestions: mappedDestSuggestions });
    }

    res.status(200).json({ success: true, results: resp }).end();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const getToken =  async (_: express.Request, res: express.Response) => {
  try {
    const token = await assemblyAiClient.realtime.createTemporaryToken({ expires_in: 21600 });
    res.cookie('AUTH-TOKEN', token); // TODO: consume in FE
    res.status(200).json({ token }).end();
  } catch (error: any) {
    console.log(error);
    res.status(400);
  }
};

export const getCustomer = async (_: express.Request, res: express.Response) => {
  try {
    const customers = await stripe.customers.search({
      query: 'email:\'kegid22000@pixdd.com\''
    });
    res.status(200).json({ customers }).end();
  } catch (error) {
    console.log(error);
    res.status(400);
  }
};