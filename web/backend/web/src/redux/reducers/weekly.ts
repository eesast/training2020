import { IWeeklyAction } from "../types/actions";
import {
  GET_ARTICLE_FEEDS_FAILURE,
  GET_ARTICLE_FEEDS_REQUEST,
  GET_ARTICLE_FEEDS_SUCCESS,
} from "../types/constants";
import { IWeeklyState } from "../types/state";

export default function weekly(
  state: IWeeklyState = {
    articles: {
      fetching: false,
      hasMore: false,
      items: [],
    },
    comments: {
      fetching: false,
      items: [],
    },
  },
  action: IWeeklyAction
): IWeeklyState {
  switch (action.type) {
    case GET_ARTICLE_FEEDS_REQUEST:
      return {
        ...state,
        articles: {
          ...state.articles,
          fetching: true,
          error: null,
        },
      };
    case GET_ARTICLE_FEEDS_SUCCESS:
      const newArticles = action.payload.articles;
      const pageSize = action.payload.pageSize;

      return {
        ...state,
        articles: {
          ...state.articles,
          fetching: false,
          hasMore: newArticles.length === pageSize,
          items: [...state.articles.items, ...newArticles],
        },
      };
    case GET_ARTICLE_FEEDS_FAILURE:
      return {
        ...state,
        articles: {
          ...state.articles,
          fetching: false,
          error: action.payload,
        },
      };
  }
  return state;
}
