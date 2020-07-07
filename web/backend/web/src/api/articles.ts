import axios from "axios";
import { IArticle } from "../redux/types/state";

export const getArticleFeeds = async (begin: number, end: number) => {
  const response = await axios.get(
    `/v1/articles?begin=${begin}&end=${end}&noContent=true`
  );
  return response.data as IArticle[];
};
