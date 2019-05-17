import * as React from "react";
import { UpdateFields, getUserPool } from "../../utils";
import {
  IAuthenticationDetailsData,
  AuthenticationDetails,
  CognitoUserPool,
  ICognitoUserData,
  CognitoUser
} from "amazon-cognito-identity-js";
import { RouteComponentProps } from "react-router";
import AWS from "aws-sdk";
import { getIdentityPoolId, getCognitoLoginId } from "../../utils/user";
import { Page } from "./Page";
import { TextInput, TextInputWidth } from "../elements/TextInput";
import { Button } from "../elements/Button";

const SignIn: React.FunctionComponent<RouteComponentProps> = props => {
  const [username, setUsername]: [
    string,
    React.Dispatch<string>
  ] = React.useState("username");
  const [password, setPassword]: [
    string,
    React.Dispatch<string>
  ] = React.useState("P@ssword2");

  const updateUsername: UpdateFields = event => {
    setUsername(event.currentTarget.value);
  };

  const updatePassword: UpdateFields = event => {
    setPassword(event.currentTarget.value);
  };

  const signIn: () => void = () => {
    const authenticationData: IAuthenticationDetailsData = {
      Username: username,
      Password: password
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userPool: CognitoUserPool = getUserPool();
    const userData: ICognitoUserData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    const IdentityPoolId = getIdentityPoolId();
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        const cognitoLoginId = getCognitoLoginId();
        AWS.config.region = "eu-west-2";
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: IdentityPoolId,
          Logins: {
            [cognitoLoginId]: result.getIdToken().getJwtToken()
          }
        });
        props.history.push("/create-collection");
      },
      onFailure: function(error: any) {
        console.log(error);
      }
    });
  };

  return (
    <>
      <Page title="Sign In">
        <fieldset className="govuk-fieldset">
          <TextInput
            value={username}
            onChange={updateUsername}
            id="username"
            labelText="Username"
            width={TextInputWidth.Quarter}
          />
          <TextInput
            value={password}
            onChange={updatePassword}
            id="password"
            labelText="Password"
            width={TextInputWidth.Quarter}
            type="password"
          />
          <Button text="Sign In" onClick={signIn} />
        </fieldset>
      </Page>
    </>
  );
};

export { SignIn };
