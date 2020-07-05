import axios from "axios";
// import { ITeam } from "../redux/types/state";

export const getBattleHistory = async (contestId: number, teamId: number) => {};

export const startBattle = async (
  contestId: number,
  teams: number[],
  port: number
) => {
  try {
    await axios.post(`/v1/rooms`, {
      contestId: contestId,
      teams: teams,
      ip: "", // ip暂无实际作用
      port: port,
    });
  } catch (e) {
    return "Error: Battle not start";
  }
};
