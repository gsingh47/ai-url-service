import { z } from "zod";

export const HotelsInputFieldsSchema = z.object({
  destinationName:z.string(),
  checkInDate:z.string().nullable(),
  checkOutDate:z.string().nullable(),
  adultCount:z.string().nullable(),
  childCount:z.string().nullable(),
  childAges:z.string().array().nullable(),
  roomCount:z.string().nullable()
});


export type HotelsFieldsSchema = z.infer<typeof HotelsInputFieldsSchema>;