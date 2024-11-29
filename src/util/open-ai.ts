import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { FLIGHT_SYSTEM_PROMPT, flightsSystemPromot } from "./prompts";
import { FlightsFieldsSchema, FlightsInputFieldsSchema } from "../schemas/flights";

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

export const generateStructuredOutput = async (prompt: string): Promise<FlightsFieldsSchema | null> => {
    if (!prompt) {
        return null;
    }
    const promptText = prompt.trim();
    const startTime = performance.now();
    const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: flightsSystemPromot()
            },
            {
                role: "user",
                content: promptText,
            },
        ],
        response_format: zodResponseFormat(FlightsInputFieldsSchema, "input_extraction")
    });
    const endTime = performance.now();

    const json = completion.choices[0].message?.parsed;
    console.log(json);
    console.log(`Time taken: ${endTime - startTime} milliseconds`);
    return json;
};