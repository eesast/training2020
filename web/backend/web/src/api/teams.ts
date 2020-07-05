import axios from "axios";
import { ITeam } from "../redux/types/state";

export const getTeams = async (
  self: boolean,
  contestId: number,
  begin?: number,
  end?: number
) => {
  if (!begin && !end) {
    const response = await axios.get(
      `/v1/teams?self=${self}&contestId=${contestId}`
    );
    return response.data as ITeam[];
  } else {
    const response = await axios.get(
      `/v1/teams?self=${self}&contestId=${contestId}&begin=${begin}&end=${end}`
    );
    return response.data as ITeam[];
  }
};

export const createTeam = async (
  name: string,
  description: string,
  contestId: number
) => {
  const response = await axios.post("/v1/teams", {
    name,
    description,
    contestId,
  });
  return response.data.inviteCode as string;
};

export const updateTeam = async (
  id: number,
  name: string,
  description: string,
  contestId: number,
  members: number[]
) => {
  await axios.put(`/v1/teams/${id}`, {
    name,
    description,
    contestId,
    members,
  });
};

export const deleteTeam = async (id: number) => {
  await axios.delete(`/v1/teams/${id}`);
};

export const quitTeam = async (id: number, memberId: number) => {
  await axios.delete(`v1/teams/${id}/members/${memberId}`);
};

export const addTeamMember = async (
  teamId: number,
  id: number,
  inviteCode: string
) => {
  await axios.post(`/v1/teams/${teamId}/members`, {
    id,
    inviteCode,
  });
};

export const getContestId = async (type: string, year: number) => {
  const response = await axios.get(`/v1/contests?type=${type}&year=${year}`);
  return response.data[0].id as number;
};

export const getTeamNum = async (contestId: number) => {
  const response = await axios.get(`/v1/contests/${contestId}`);
  return response.data.totalTeams as number;
};
