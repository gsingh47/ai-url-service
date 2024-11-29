import { z } from "zod";

enum TripType {
  ROUND_TRIP = 'roundtrip',
  ONE_WAY = 'oneway',
  MULTI_CITY = 'multi'
};

enum CabinType {
  ECONOMY = 'economy',
  PREMIUM_ECONOMY = 'premium',
  BUSINESS_CLASS = 'business',
  FIRST_CLASS = 'first'
};

enum YesOrNo {
  YES = 'Y',
  NO = 'N'
};

export const FlightsInputFieldsSchema = z.object({
  tripType: z.nativeEnum(TripType).default(TripType.ONE_WAY),
  originAirportName: z.string().nullable(),
  originAirportCode: z.string().nullable(),
  destinationAirportName: z.string().nullable(),
  destinationAirportCode: z.string().nullable(),
  returnOriginAirportName: z.string().nullable(),
  returnOriginAirportCode: z.string().nullable(),
  returnDestinationAirportName: z.string().nullable(),
  returnDestinationAirportCode: z.string().nullable(),
  departureDate: z.string().nullable(),
  returnDate: z.string().nullable(),
  adultCount: z.number(),
  childCount: z.number(),
  childAges: z.number().array(),
  cabinClass: z.nativeEnum(CabinType).default(CabinType.ECONOMY),
  infantInLap: z.nativeEnum(YesOrNo).default(YesOrNo.NO)
});

export type FlightsFieldsSchema = {
  tripType: TripType,
  originAirportName: string | null,
  originAirportCode: string | null,
  destinationAirportName: string | null,
  destinationAirportCode: string | null,
  returnOriginAirportName: string | null,
  returnOriginAirportCode: string | null,
  returnDestinationAirportName: string | null,
  returnDestinationAirportCode: string | null,
  departureDate: string | null,
  returnDate: string | null,
  adultCount: number,
  childCount: number,
  childAges: number[],
  cabinClass: CabinType,
  infantInLap: YesOrNo
};

export const expediaFlightsSchemaMapping: any = () => ({
  mode: 'search',
  trip: 'tripType',
  leg1: {
    from: 'originAirportName',
    to: 'destinationAirportName',
    departure: 'departureDate',
    fromType: 'A',
    toType: 'A'
  },
  leg2: {
    from: 'returnOriginAirportName',
    to: 'returnDestinationAirportName',
    departure: 'returnDate',
    fromType: 'A',
    toType: 'A'
  }, 
  options: {
    cabinClass: 'cabinClass',
  },
  fromDate: 'departureDate',
  toDate: 'returnDate',
  d1: 'departureDate',
  d2: 'returnDate',
  passengers: {
    adults: 'adultCount',
    children: 'childAges',
    infantinlap: 'infantInLap'
  }
});

export const flightsSiteSchemaOptionalFields = new Set(['leg2']);