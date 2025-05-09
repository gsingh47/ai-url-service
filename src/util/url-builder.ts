import { FlightsFieldsSchema, expediaFlightsSchemaMapping, flightsSiteSchemaOptionalFields } from "../schemas/flights";
import { Site } from "./constants";

let globalVars: {departureDate?: string, returnDate?: string} = {};

export const buildFlightsUrl = (schema: FlightsFieldsSchema | null, site: string = Site.EXPEDIA) => {
  if (!schema) {
    return null;
  }

  globalVars = {};
  const expediaFlightsMappedSchema = expediaFlightsSchemaMapping();
  const keys = Object.keys(expediaFlightsMappedSchema);

  keys.forEach(key => {
    const resp = mapFlightsSchemaRecurse(expediaFlightsMappedSchema[key], schema, site);
    if (flightsSiteSchemaOptionalFields.has(key) && isNullPresent(resp)) {
      expediaFlightsMappedSchema[key] = null;
    } else {
      expediaFlightsMappedSchema[key] = resp;
    }
  });

  const queryParamString = keys.map(key => {
    if (expediaFlightsMappedSchema[key]) {
      return `${key}=${mapSubQueryParamString(expediaFlightsMappedSchema[key])}`;
    }
  }).filter(item => item)
  .join('&');

  return { schema: expediaFlightsMappedSchema, url: `/Flights-Search?${queryParamString}`, searchTitle: getSearchTitle(schema)};
};

const mapFlightsSchemaRecurse = (obj: any, schema: FlightsFieldsSchema, site: string) => {
  if (!obj) {
    return obj;
  }

  const objType = typeof obj;

  if (objType === 'string' || objType === 'number') {
    if (isKeyOfFlightsSchema(obj, schema) && Array.isArray(schema[obj])) {
      const array = schema[obj];
      const agesString = !!array.length ? `[${array.join(';')}]` : '';
      return `${array.length}${agesString}`;
    }
    if (isKeyOfFlightsSchema(obj, schema) && obj.endsWith('Date')) {
      const date = schema[obj];
      return typeof date === 'string' ? getUpdatedDate(obj, date, schema) : date;
    }
    if (isKeyOfFlightsSchema(obj, schema)) {
      return runStrategy(obj, schema, site);
    }
    
    return obj;
  }
  
  
  objType === 'object' && Object.keys(obj).forEach(key => {
    const flightsSchemaKey = obj[key];
    const resp = mapFlightsSchemaRecurse(flightsSchemaKey, schema, site);
    obj[key] = resp;
  });

  return obj;
};

const runStrategy = (key: keyof FlightsFieldsSchema, schema: FlightsFieldsSchema, site: string) => {
  switch (site) {
    case Site.EXPEDIA:
      return expediaStrategyMapAirportCodes(key, schema);
    default:
      return schema[key];
  }
};

const expediaStrategyMapAirportCodes = (key: keyof FlightsFieldsSchema, schema: FlightsFieldsSchema) => {
  if (key === 'originAirportName') {
    return `(${schema.originAirportCode}-${schema[key]})`;

  } else if (key === 'destinationAirportName') {
    return `(${schema.destinationAirportCode}-${schema[key]})`;

  } else if (key === 'returnOriginAirportName') {
    return `(${schema.returnOriginAirportCode}-${schema[key]})`;

  } else if (key === 'returnDestinationAirportName') {
    return `(${schema.returnDestinationAirportCode}-${schema[key]})`;
  }
  return schema[key];
};

const getUpdatedDate = (key: keyof FlightsFieldsSchema, date: string | null, schema: FlightsFieldsSchema) => {
  const currentDate = new Date(); currentDate.setHours(0,0,0,0);
  let departureDate = schema.departureDate && new Date(globalVars.departureDate ?? schema.departureDate);
  const returnDate = schema.returnDate && new Date(schema.returnDate);

  if (departureDate) {
    switch (key) {
      case 'departureDate': {
        if (departureDate < currentDate && returnDate) { // roundTrip
          departureDate = currentDate;
          departureDate.setDate(departureDate.getDate() + 15);
        } else if (departureDate < currentDate) { // oneWay
          departureDate.setFullYear(currentDate.getFullYear() + 1);
        }

        const desiredDateFormat = departureDate.toLocaleDateString();
        globalVars.departureDate = desiredDateFormat;

        return desiredDateFormat;
      };
      case 'returnDate': {
        if (returnDate && returnDate < currentDate) {
          returnDate.setFullYear(currentDate.getFullYear() + 1);
          if (returnDate < departureDate) {
            returnDate.setDate(departureDate.getDate() + 7);
          }
        } else if (returnDate && returnDate < departureDate) {
          returnDate.setFullYear(departureDate.getFullYear() + 1);
        }
        return returnDate ? returnDate.toLocaleDateString() : date;
      };
      default: date;
    }
  }
};

const isKeyOfFlightsSchema = (key: string, schema: FlightsFieldsSchema): key is keyof FlightsFieldsSchema => {
  return key in schema;
};

const isNullPresent = (object: any): boolean => {
  return object && Object.values(object).findIndex(item => item === null) >= 0;
};

const mapSubQueryParamString = (object: any): string => {
  return typeof object === 'object' ? 
    Object.keys(object).map(key => `${key}:${object[key]}`).join(',') : object;
};

const getSearchTitle = (schema: FlightsFieldsSchema): string => {
  const originCode = schema.originAirportCode;
  const destinationCode = schema.destinationAirportCode;
  const departureDate = schema.departureDate;
  const returnDate = schema.returnDate ? `, Return:${schema.returnDate}` : '';

  return `${originCode} to ${destinationCode}, Departure:${departureDate}${returnDate}`;
};