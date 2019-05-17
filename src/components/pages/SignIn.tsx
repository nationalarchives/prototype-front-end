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
  ] = React.useState("");
  const [password, setPassword]: [
    string,
    React.Dispatch<string>
  ] = React.useState("");

  const [error, setError]: [string, React.Dispatch<string>] = React.useState<
    string
  >("");

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
        setError("");
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
      onFailure: function(error: { code: string }) {
        console.log(error);
        switch (error.code) {
          case "InvalidParameterException":
            setError("Please fill in username and password");
            break;
          case "UserNotFoundException":
            setError("User does not exist");
            break;
          case "NotAuthorizedException":
            setError("Incorrect username or password");
            break;
          default:
            setError("An unknow error occurred");
        }
      }
    });
  };

  return (
    <>
      <Page title="Sign In">
        <div
          className={`govuk-form-group ${
            error.length > 0 ? "govuk-form-group--error" : ""
          }`}
        >
          <fieldset className="govuk-fieldset" aria-describedby="signin-error">
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
            {error.length > 0 && (
              <span id="signin-error" className="govuk-error-message">
                <span className="govuk-visually-hidden">Error:</span> {error}
              </span>
            )}
          </fieldset>
        </div>
      </Page>
    </>
  );
};

export { SignIn };
