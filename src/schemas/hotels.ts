import { z } from "zod";

const HotelsInputFieldsSchema = z.object({
  destinationName:z.string(),
  destinationCoordinates:z.object({
      latitude:z.number(),
      longitude:z.number()
  }),
  checkInDate:z.string(),
  checkOutDate:z.string(),
  adultCount:z.number(),
  childCount:z.number()
});