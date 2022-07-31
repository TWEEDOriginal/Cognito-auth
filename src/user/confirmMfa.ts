import { APIGatewayProxyEvent } from "aws-lambda";
import CognitoIdentityServiceProvider from "aws-sdk/clients/cognitoidentityserviceprovider";
import { sendResponse } from "../utils";

const cognito = new CognitoIdentityServiceProvider();

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const body = JSON.parse(event.body as string);

    const { Session, token, username } = body;
    if (!Session || !token || !username)
      return sendResponse(400, { message: "Invalid input" });
    const { user_pool_id, client_id } = process.env;
    const params: CognitoIdentityServiceProvider.AdminRespondToAuthChallengeRequest =
      {
        ChallengeName: "SOFTWARE_TOKEN_MFA",
        UserPoolId: user_pool_id as string,
        ClientId: client_id as string,
        Session,
        ChallengeResponses: {
          SOFTWARE_TOKEN_MFA_CODE: token as string,
          USERNAME: username,
        },
      };
    const result = await cognito.adminRespondToAuthChallenge(params).promise();

    console.info(result);

    return sendResponse(200, {
      message: "Success",
      data: {
        id_token: result?.AuthenticationResult?.IdToken,
        access_token: result?.AuthenticationResult?.AccessToken,
      },
    });
  } catch (error) {
    console.info(error);
    let message = "Internal server error";
    if (error instanceof Error) {
      message = error.message;
    }
    return sendResponse(500, { message });
  }
};
