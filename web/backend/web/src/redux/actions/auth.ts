import { createAsyncAction, createAction } from "typesafe-actions";
import api from "../../api";
import {
  ILoginAction,
  IThunkResult,
  IVerifyTokenAction,
} from "../types/actions";
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  UPDATE_USER,
  VERIFY_TOKEN_REQUEST,
  VERIFY_TOKEN_SUCCESS,
  VERIFY_TOKEN_FAILURE,
} from "../types/constants";
import { IUser } from "../types/state";

export const loginAction = createAsyncAction(
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
)<undefined, string, Error>();

export function login(
  username: string,
  password: string
): IThunkResult<ILoginAction> {
  return async (dispatch) => {
    dispatch(loginAction.request());

    try {
      const token = await api.login(username, password);
      dispatch(loginAction.success(token));
    } catch (e) {
      dispatch(loginAction.failure(e));
    }
  };
}

export const updateUserAction = createAction(
  UPDATE_USER,
  (id: number, user: IUser) => ({ id, user })
)();

export const verifyTokenAction = createAsyncAction(
  VERIFY_TOKEN_REQUEST,
  VERIFY_TOKEN_SUCCESS,
  VERIFY_TOKEN_FAILURE
)<string, IUser, Error>();

export function verifyToken(token: string): IThunkResult<IVerifyTokenAction> {
  return async (dispatch) => {
    dispatch(verifyTokenAction.request(token));

    try {
      const response = await api.verifyToken(token);
      const userId = response.id;
      const user = await api.getUserInfo(userId);
      dispatch(verifyTokenAction.success(user));
    } catch (e) {
      dispatch(verifyTokenAction.failure(e));
    }
  };
}
