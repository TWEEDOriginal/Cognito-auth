export type LambdaResponse = {
  headers: HeaderOption;
  statusCode: number;
  body: string;
};

interface HeaderOption {
  "Access-Control-Allow-Origin": string;
}

export interface responseBody {
  message: string;
  data?: {
    [key: string]: any;
  };
}
export interface loginRequest {
  email: string;
  password: string;
}
