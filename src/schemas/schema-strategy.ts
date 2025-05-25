import { SearchType } from "../util/constants";
import { FlightsInputFieldsSchema } from "./flights";
import { HotelsInputFieldsSchema } from "./hotels";

export const getSchemaStrategy = (searchType: string) => {
  if (searchType === SearchType.HOTELS) {
    return HotelsInputFieldsSchema;
  } else if (searchType === SearchType.FLIGHTS) {
    return FlightsInputFieldsSchema; 
  }
  return HotelsInputFieldsSchema;
}