export const FLIGHT_SYSTEM_PROMPT = 'You are an expert at structured data extraction. You will be given unstructured text, and your task is to convert it into the given structure. Only use airport codes for fields originAirportCode, destinationAirportCode. If the provided origin or destination is not an airport, use the popular airport from the given city. Use mm/dd/yyyy format for dates.';
export const HOTEL_SYSTEM_PROMPT = 'You are an expert at structured data extraction. You will be given unstructured text, and your task is to convert it into the given structure. Use 2024 year if year is not provided.';

export const flightsSystemPromot = () => {
  const currentDate = new Date().toISOString().split('T')[0].replaceAll('-', '/');
  return `${FLIGHT_SYSTEM_PROMPT} If provided then don't use dates before ${currentDate}.`;
};