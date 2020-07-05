import { ITeamsAction } from "../types/actions";
import {
  GET_TEAMS_FAILURE,
  GET_TEAMS_REQUEST,
  GET_TEAMS_SUCCESS,
  GET_SELF_TEAM_REQUEST,
  GET_SELF_TEAM_SUCCESS,
  GET_SELF_TEAM_FAILURE,
  GET_CONTEST_ID_REQUEST,
  GET_CONTEST_ID_SUCCESS,
  GET_CONTEST_ID_FAILURE,
  GET_TEAM_NUM_REQUEST,
  GET_TEAM_NUM_SUCCESS,
  GET_TEAM_NUM_FAILURE,
} from "../types/constants";
import { ITeamsState } from "../types/state";

export default function teams(
  state: ITeamsState = {
    fetching: false,
    items: [],
    selfTeam: {
      id: 0,
      contestId: 0,
      name: "noSelfTeamUser",
      description: "noSelfTeamUser",
      leader: 0,
      members: [0],
    },
    totalTeams: 50,
  },
  action: ITeamsAction
): ITeamsState {
  switch (action.type) {
    case GET_TEAMS_REQUEST:
      return {
        ...state,
        fetching: true,
        error: null,
      };
    case GET_TEAMS_SUCCESS:
      const newTeams = action.payload;

      return {
        ...state,
        fetching: false,
        // items: [...state.items, ...newTeams]
        items: [...newTeams],
      };
    case GET_TEAMS_FAILURE:
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };

    case GET_TEAM_NUM_REQUEST:
      return {
        ...state,
        error: null,
      };
    case GET_TEAM_NUM_SUCCESS:
      const num = action.payload;
      return {
        ...state,
        totalTeams: num,
      };
    case GET_TEAM_NUM_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_SELF_TEAM_REQUEST:
      return {
        ...state,
        error: null,
      };
    case GET_SELF_TEAM_SUCCESS:
      const team = action.payload;
      return {
        ...state,
        selfTeam: team,
      };
    case GET_SELF_TEAM_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_CONTEST_ID_REQUEST:
      return {
        ...state,
        fetching: true,
        error: null,
      };
    case GET_CONTEST_ID_SUCCESS:
      const contestId = action.payload;

      return {
        ...state,
        fetching: false,
        contestId: contestId,
      };
    case GET_CONTEST_ID_FAILURE:
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
  }
  return state;
}
