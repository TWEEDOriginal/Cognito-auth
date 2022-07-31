import { APIGatewayProxyEvent } from "aws-lambda";
import CognitoIdentityServiceProvider from "aws-sdk/clients/cognitoidentityserviceprovider";
import { sendResponse, validateInput } from "../utils";

const cognito = new CognitoIdentityServiceProvider();

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const body = JSON.parse(event.body as string);
    const isValid = validateInput(body);
    if (!isValid) return sendResponse(400, { message: "Invalid input" });

    const { email, password } = body;
    const { user_pool_id, client_id } = process.env;
    const params: CognitoIdentityServiceProvider.AdminInitiateAuthRequest = {
      AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
      UserPoolId: user_pool_id as string,
      ClientId: client_id as string,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };
    const result = await cognito.adminInitiateAuth(params).promise();

    console.info(result);

    if (result?.AuthenticationResult)
      return sendResponse(200, {
        message: "Success",
        data: {
          id_token: result?.AuthenticationResult?.IdToken,
          access_token: result?.AuthenticationResult?.AccessToken,
        },
      });

  return sendResponse(200, {
    message: "Mfa Required",
    data: {
      challengeName: result?.ChallengeName,
      session: result?.Session,
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
