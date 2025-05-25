import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { FLIGHT_SYSTEM_PROMPT, getSystemPromptStrategy } from "./prompts";
import { FlightsFieldsSchema, FlightsInputFieldsSchema } from "../schemas/flights";
import { SearchType, Site } from "./constants";
import { getSchemaStrategy } from "../schemas/schema-strategy";
import { HotelsFieldsSchema } from "../schemas/hotels";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const completions = async (prompt: string) => {
    if (!prompt) {
        return;
    }
    const promptText = prompt.trim();
    const startTime = performance.now();
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: FLIGHT_SYSTEM_PROMPT
            },
            {
                role: "user",
                content: promptText,
            },
        ],
        response_format: zodResponseFormat(FlightsInputFieldsSchema, "input_extraction")
    });
    const endTime = performance.now();

    const jsonRaw = completion.choices[0].message?.content;

    if (jsonRaw) {
        const jsonObject = JSON.parse(jsonRaw);
        console.log(jsonObject);
        console.log(`Time taken: ${endTime - startTime} milliseconds`);
        return jsonObject;
    }
};

export const generateStructuredOutput = async (prompt: string, searchType: string = SearchType.HOTELS, site: string = Site.BOOKING_DOT_COM,): Promise<FlightsFieldsSchema | HotelsFieldsSchema | null> => {
    if (!prompt) {
        return null;
    }
    const promptText = prompt.trim();
    const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: getSystemPromptStrategy(searchType)
            },
            {
                role: "user",
                content: promptText,
            },
        ],
        response_format: zodResponseFormat(getSchemaStrategy(searchType), "input_extraction")
    });

    const json = completion.choices[0].message?.parsed;
    return json;
};