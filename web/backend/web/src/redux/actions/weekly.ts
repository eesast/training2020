import { createAsyncAction } from "typesafe-actions";
import api from "../../api";
import { IGetArticleFeedsAction, IThunkResult } from "../types/actions";
import {
  GET_ARTICLE_FEEDS_FAILURE,
  GET_ARTICLE_FEEDS_REQUEST,
  GET_ARTICLE_FEEDS_SUCCESS,
} from "../types/constants";
import { IArticle } from "../types/state";

export const getArticleFeedsAction = createAsyncAction(
  GET_ARTICLE_FEEDS_REQUEST,
  GET_ARTICLE_FEEDS_SUCCESS,
  GET_ARTICLE_FEEDS_FAILURE
)<undefined, { articles: IArticle[]; pageSize: number }, Error>();

export function getArticleFeeds(
  page: number,
  pageSize: number
): IThunkResult<IGetArticleFeedsAction> {
  return async (dispatch) => {
    dispatch(getArticleFeedsAction.request());

    try {
      const articles = await api.getArticleFeeds(
        page * pageSize,
        (page + 1) * pageSize - 1
      );
      dispatch(getArticleFeedsAction.success({ articles, pageSize }));
    } catch (e) {
      dispatch(getArticleFeedsAction.failure(e));
    }
  };
}
