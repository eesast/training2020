import axios from "axios";

export interface ICode {
  id: number;
  contestId: number;
  teamId: number;
  name: string;
  content: string;
  language: string;
  compileInfo: string;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
}

export const getCodes = async (
  contestId: number,
  teamId: number,
  begin: number,
  end: number
) => {
  const response = await axios.get(
    `/v1/codes?contestId=${contestId}&teamId=${teamId}&begin=${begin}&end=${end}`
  );
  return response.data as ICode[];
};

export const createCode = async (
  teamId: number,
  contestId: number,
  code: File,
  language: string
) => {
  const codeContent = await code.text();
  const response = await axios.post(`/v1/codes`, {
    name: code.name,
    content: codeContent,
    language: language,
    teamId: teamId,
    contestId: contestId,
  });
  return response;
};

export const compileCode = async (codeId: number, role?: number) => {
  const response = await axios.post(`/v1/codes/${codeId}/compile`, {
    role: role ? role : 0,
  });
  return response.statusText;
};

export const updateCode = async (
  codeId: number,
  name?: string,
  content?: string,
  language?: string
) => {
  const response = await axios.put(`/v1/codes/${codeId}`, {
    name,
    content,
    language,
  });
  return response.statusText;
};

export const deleteCode = async (codeId: number) => {
  await axios.delete(`/v1/codes/${codeId}`);
};
