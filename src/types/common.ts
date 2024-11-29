export type ResponseType = {
  success: boolean;
  schema?: any;
  url?: string;
  error?: string;
};

export type ValidationErrors = {
  origin?: boolean;
  destination?: boolean;
  children?: {
    count: number;
    agesMissingCount: number;
  };
};