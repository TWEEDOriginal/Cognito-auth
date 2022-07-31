import { APIGatewayProxyEvent } from "aws-lambda";
import { LambdaResponse } from "../types";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<LambdaResponse> => {
  console.info(event);
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    statusCode: 200,
    body: JSON.stringify("Lambda is alive!"),
  };
};
