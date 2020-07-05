import axios from "axios";

export interface IAnnouncement {
  id: number;
  contestId: number;
  title: string;
  content: string;
  priority: number;
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
}

export const getAnnouncements = async (
  begin: number,
  end: number,
  contestId: number
) => {
  const response = await axios.get(
    `/v1/announcements?begin=${begin}&end=${end}&contestId=${contestId}`
  );
  return response.data as IAnnouncement[];
};
