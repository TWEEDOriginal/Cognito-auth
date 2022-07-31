import { APIGatewayProxyEvent } from "aws-lambda";
import { sendResponse } from "../utils";

export const handler =  async (event: APIGatewayProxyEvent) => {
  return sendResponse(200, {
    message: `Email ${event.requestContext?.authorizer?.claims?.email} has been authorized`,
  });
};
