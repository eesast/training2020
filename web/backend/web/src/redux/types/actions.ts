import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { ActionType } from "typesafe-actions";
import {
  loginAction,
  updateUserAction,
  verifyTokenAction,
} from "../actions/auth";
import { getArticleFeedsAction } from "../actions/weekly";
import {
  getTeamsAction,
  getTeamNumAction,
  getSelfTeamAction,
  getContestIdAction,
} from "../actions/teams";
import { IAppState } from "./state";

export type IThunkResult<T extends AnyAction> = ThunkAction<
  void,
  IAppState,
  undefined,
  T
>;

export type ILoginAction = ActionType<typeof loginAction>;
export type IUpdateUserAction = ActionType<typeof updateUserAction>;
export type IVerifyTokenAction = ActionType<typeof verifyTokenAction>;

export type IAuthAction = ILoginAction | IUpdateUserAction | IVerifyTokenAction;

export type IGetArticleFeedsAction = ActionType<typeof getArticleFeedsAction>;

export type IWeeklyAction = IGetArticleFeedsAction;

export type IGetTeamsAction = ActionType<typeof getTeamsAction>;

export type IGetTeamNumAction = ActionType<typeof getTeamNumAction>;

export type IGetSelfTeamAction = ActionType<typeof getSelfTeamAction>;

export type IGetContestIdAction = ActionType<typeof getContestIdAction>;

export type ITeamsAction =
  | IGetTeamsAction
  | IGetTeamNumAction
  | IGetSelfTeamAction
  | IGetContestIdAction;

export type IAppAction = IAuthAction | IWeeklyAction | ITeamsAction;
