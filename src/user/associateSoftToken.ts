import { APIGatewayProxyEvent } from "aws-lambda";
import CognitoIdentityServiceProvider from "aws-sdk/clients/cognitoidentityserviceprovider";
import { sendResponse } from "../utils";

const cognito = new CognitoIdentityServiceProvider();

export const handler = async (event: APIGatewayProxyEvent) => {
  console.info(event);
  const { AccessToken } = JSON.parse(event.body as string);

  if (!AccessToken) return sendResponse(400, { message: "Invalid input" });

  const params: CognitoIdentityServiceProvider.AssociateSoftwareTokenRequest = {
    AccessToken,
  };

  const response = await cognito.associateSoftwareToken(params).promise();
  console.info(response);
  return sendResponse(200, {
    message: "Success",
    data: response,
  });
};
