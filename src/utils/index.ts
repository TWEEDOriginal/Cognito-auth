import { responseBody, loginRequest } from "../types";

export const sendResponse = (statusCode: number, body: responseBody) => {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
  return response;
};

export const validateInput = (data: loginRequest) => {
  const { email, password } = data;
  if (!email || !password || password.length < 8) return false;
  return true;
};
