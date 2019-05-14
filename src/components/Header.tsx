import * as React from "react";
import { getCurrentUser } from "../utils";
import { CognitoUser } from "amazon-cognito-identity-js";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

interface IHeaderProps {
  signedIn?: boolean;
  text?: string;
}

const Header: React.FunctionComponent<
  IHeaderProps & RouteComponentProps
> = props => {
  const signout: () => void = () => {
    const user: CognitoUser | null = getCurrentUser();
    if (user !== null) {
      user.signOut();
      props.history.push("/signin");
    }
  };

  return (
    <header className="App-header">
      {props.signedIn ? (
        <div onClick={signout}>Sign Out</div>
      ) : (
        <Link to="/signin">Sign In</Link>
      )}
      {props.text}
    </header>
  );
};

export { Header };
