import { APIGatewayProxyEvent } from "aws-lambda";
import CognitoIdentityServiceProvider from "aws-sdk/clients/cognitoidentityserviceprovider";
import { sendResponse, validateInput } from "../utils";

const cognito = new CognitoIdentityServiceProvider();

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    console.info(event);
    const body = JSON.parse(event.body as string);
    const isValid = validateInput(body);
    if (!isValid) return sendResponse(400, { message: "Invalid input" });

    const { email, password } = body;
    const { user_pool_id } = process.env;
    const params: CognitoIdentityServiceProvider.AdminCreateUserRequest = {
      UserPoolId: user_pool_id as string,
      Username: email,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "email_verified",
          Value: "true",
        },
      ],
      MessageAction: "SUPPRESS",
    };
    const response = await cognito.adminCreateUser(params).promise();
    if (response.User) {
      const paramsForSetPass: CognitoIdentityServiceProvider.AdminSetUserPasswordRequest =
        {
          Password: password,
          UserPoolId: user_pool_id as string,
          Username: email,
          Permanent: true,
        };
      await cognito.adminSetUserPassword(paramsForSetPass).promise();
    }

    return sendResponse(200, { message: "User registration successful" });
  } catch (error) {
    console.info(error);
    let message = "Internal server error";
    if (error instanceof Error) {
      message = error.message;
    }

    return sendResponse(500, { message });
  }
};
