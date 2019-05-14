import React from "react";
import "./App.css";
import { getCurrentUser } from "./utils";
import { SignIn } from "./components/SignIn";
import { Upload } from "./components/Upload";
import { CreateCollection } from "./components/CreateCollection";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps
} from "react-router-dom";

interface IPrivateRouteProps extends RouteProps {
  component: React.FunctionComponent<RouteComponentProps>;
}

const App: React.FunctionComponent = () => {
  const PrivateRoute: React.FunctionComponent<IPrivateRouteProps> = ({
    component: Component,
    ...rest
  }) => {
    return (
      <Route
        {...rest}
        render={props =>
          getCurrentUser() ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/signin",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  };

  return (
    <div className="App">
      <Router>
        <Route path="/" exact={true} component={SignIn} />
        <Route path="/signin" component={SignIn} />
        <PrivateRoute path="/create-collection" component={CreateCollection} />
        <PrivateRoute path="/upload/:id" component={Upload} />
      </Router>
    </div>
  );
};

export default App;
