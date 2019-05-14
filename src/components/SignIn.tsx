import * as React from "react";
import { UpdateFields, getUserPool, getCurrentUser } from "../utils";
import {
  IAuthenticationDetailsData,
  AuthenticationDetails,
  CognitoUserPool,
  ICognitoUserData,
  CognitoUser
} from "amazon-cognito-identity-js";
import { Header } from "./Header";
import { RouteComponentProps } from "react-router";
import AWS from "aws-sdk";
import { getIdentityPoolId, getCognitoLoginId } from "../utils/user";

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
      <Header signedIn={getCurrentUser() !== null} {...props} />
      <div id="signin">
        <input
          id="username"
          value={username}
          onChange={updateUsername}
          type="text"
          placeholder="username"
        />
        <input
          id="password"
          value={password}
          onChange={updatePassword}
          type="password"
          placeholder="password"
        />
        <button onClick={signIn}>Sign in</button>
      </div>
    </>
  );
};

export { SignIn };
