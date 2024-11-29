import { FlightsFieldsSchema } from "../schemas/flights";
import { ResponseType, ValidationErrors } from "../types/common";

const errorMsgsMapping = (errors: ValidationErrors): string | undefined => {
  const keys = Object.keys(errors);
  if (keys.length === 0) {
    return undefined;
  }

  let msg = keys.filter(key => key !== 'children').join(',');

  if (errors.children) {
    const { count, agesMissingCount } = errors.children;
    if (count === agesMissingCount && count === 1) {
      msg = `${msg} & child age`
    } else if (count === agesMissingCount && count > 1) {
      msg = `${msg} & children's ages`
    } else if (count !== agesMissingCount) {
      msg = `${msg} & ${agesMissingCount} of the children's ages`
    }
  }

  return `Missing ${msg}.`;
};

export const validateFlightsSchema = (schema: FlightsFieldsSchema): ResponseType => {
  const errors: ValidationErrors = {};

  if (!schema.originAirportName || !schema.originAirportCode) {
    errors.origin = true;
  }
  if (!schema.destinationAirportName || !!schema.destinationAirportCode) {
    errors.destination = true;
  }
  if (schema.childAges.length !== schema.childCount) {
    errors.children = {
      count: schema.childCount,
      agesMissingCount: schema.childCount - schema.childAges.length
    };
  }
  if (!schema.departureDate) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 15);
    schema.departureDate = currentDate.toLocaleDateString();
  }

  const errorMsg = errorMsgsMapping(errors);

  return { success: !!errorMsg, schema: schema, error: errorMsg};
};