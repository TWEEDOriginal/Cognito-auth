import { APIGatewayProxyEvent } from "aws-lambda";
import CognitoIdentityServiceProvider from "aws-sdk/clients/cognitoidentityserviceprovider";
import { sendResponse } from "../utils";
import { verifyToken } from "../utils/verifyToken";

const cognito = new CognitoIdentityServiceProvider();

export const handler = async (event: APIGatewayProxyEvent) => {
  console.info(event);
  const { enabled, token, AccessToken } = JSON.parse(event.body as string);

  if (typeof enabled !== "boolean" || !token || !AccessToken)
    return sendResponse(400, { message: "Invalid input" });

  const token_result = await verifyToken({
    AccessToken,
    UserCode: token,
  });

  if (token_result.Status !== "SUCCESS")
    return sendResponse(400, { message: "Invalid or expired token" });

  const { user_pool_id } = process.env;
  const params: CognitoIdentityServiceProvider.AdminSetUserMFAPreferenceRequest =
    {
      SoftwareTokenMfaSettings: {
        Enabled: enabled,
        PreferredMfa: enabled,
      },
      Username: event.requestContext?.authorizer?.claims?.email,
      UserPoolId: user_pool_id as string,
    };
  const response = await cognito.adminSetUserMFAPreference(params).promise();
  console.info(response);
  return sendResponse(200, {
    message: `Mfa preference set successfully`,
  });
};
