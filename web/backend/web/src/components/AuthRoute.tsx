import React from "react";
import { connect } from "react-redux";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { IAppState } from "../redux/types/state";

export interface IAuthRouteStateProps {
  loggedIn?: boolean;
}

export interface IAuthRouteProps extends IAuthRouteStateProps {
  component: React.ComponentType<any>;
}

const AuthRoute: React.FC<IAuthRouteProps & RouteProps> = ({
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      rest.loggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" push={true} />
      )
    }
  />
);

function mapStateToProps(state: IAppState): IAuthRouteStateProps {
  return {
    loggedIn: state.auth.loggedIn,
  };
}

export default connect(mapStateToProps, null)(AuthRoute);
