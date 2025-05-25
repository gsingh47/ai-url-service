import { SearchType } from "./constants";

export const FLIGHT_SYSTEM_PROMPT = 'You are an expert at structured data extraction. You will be given unstructured text, and your task is to convert it into the given structure. Only use airport codes for fields originAirportCode, destinationAirportCode. If the provided origin or destination is not an airport, use the popular airport from the given city. If provided and child age is less than a year then use 0. Use mm/dd/yyyy format for dates.';
export const HOTEL_SYSTEM_PROMPT = 'You are an expert at structured data extraction. You will be given unstructured text, and your task is to convert it into the given structure. If date provided without year then use {current} year. Use yyyy-mm-dd format for dates.';

export const currentDateFormatted = () => {
  return new Date().toISOString().split('T')[0].replaceAll('-', '/');
}

const flightsSystemPromot = () => {
  const currentDate = currentDateFormatted();
  return `${FLIGHT_SYSTEM_PROMPT} If provided then don't use dates before ${currentDate}.`;
};

const hotelsSystemPromot = () => {
  const currentYear = new Date().getFullYear();
  return HOTEL_SYSTEM_PROMPT.replace('{current}', currentYear.toString());
}

export const getSystemPromptStrategy = (searchType: string) => {
  if (searchType === SearchType.HOTELS) {
    return hotelsSystemPromot();
  } else if (searchType === SearchType.FLIGHTS) {
    return flightsSystemPromot();
  }
  return HOTEL_SYSTEM_PROMPT;
}