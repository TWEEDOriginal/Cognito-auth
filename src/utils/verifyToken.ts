import CognitoIdentityServiceProvider from "aws-sdk/clients/cognitoidentityserviceprovider";

const cognito = new CognitoIdentityServiceProvider();

export const verifyToken = async (request: CognitoIdentityServiceProvider.VerifySoftwareTokenRequest) => {

  const response = await cognito.verifySoftwareToken(request).promise();
  console.info(response);
  return response
};
