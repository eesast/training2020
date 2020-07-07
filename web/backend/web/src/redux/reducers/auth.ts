import jwtDecode from "jwt-decode";
import { IAuthAction } from "../types/actions";
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  UPDATE_USER,
  VERIFY_TOKEN_REQUEST,
  VERIFY_TOKEN_SUCCESS,
  VERIFY_TOKEN_FAILURE,
} from "../types/constants";
import { IAuthState } from "../types/state";
import axios from "axios";

export default function auth(
  state: IAuthState = {
    loggedIn: false,
    loggingIn: false,
  },
  action: IAuthAction
): IAuthState {
  switch (action.type) {
    case LOGIN_REQUEST:
      axios.defaults.headers.common["Authorization"] = "";
      return {
        ...state,
        loggingIn: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      const token = action.payload;
      const decoded = jwtDecode(token) as any;
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      return {
        ...state,
        token,
        loggedIn: true,
        loggingIn: false,
        error: null,
        user: decoded,
      };
    case LOGIN_FAILURE:
      axios.defaults.headers.common["Authorization"] = "";
      return {
        ...state,
        loggedIn: false,
        loggingIn: false,
        error: action.payload,
      };
    case UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload.user,
          id: action.payload.id,
        },
      };

    case VERIFY_TOKEN_REQUEST: {
      const token = action.payload;
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      return {
        ...state,
        token,
        loggingIn: true,
        error: null,
      };
    }
    case VERIFY_TOKEN_SUCCESS: {
      const user = action.payload;
      return {
        ...state,
        loggedIn: true,
        loggingIn: false,
        error: null,
        user: user,
      };
    }
    case VERIFY_TOKEN_FAILURE: {
      axios.defaults.headers.common["Authorization"] = "";
      return {
        ...state,
        loggedIn: false,
        loggingIn: false,
        error: action.payload,
      };
    }
  }
  return state;
}
