import { List, message } from "antd";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import FeedCard from "../components/FeedCard";
import { getArticleFeeds } from "../redux/actions/weekly";
import { IAppState, IArticle } from "../redux/types/state";
import { WithRouterComponent } from "../types/WithRouterComponent";
import styles from "./ArticleFeedPage.module.css";

interface IArticleFeedPageStateProps {
  fetching: boolean;
  hasMore: boolean;
  error?: Error | null;
  articles: IArticle[];
}

interface IArticleFeedPageDispatchProps {
  getArticleFeeds: (page: number, pageSize: number) => void;
}

type IArticleFeedPageProps = IArticleFeedPageStateProps &
  IArticleFeedPageDispatchProps;

const ArticleFeedPage: React.FC<WithRouterComponent<
  {},
  IArticleFeedPageProps
>> = (props) => {
  const { fetching, hasMore, error, articles, getArticleFeeds } = props;

  const [page, setPage] = useState(0);

  const handleInfiniteLoadMore = () => {
    getArticleFeeds(page, 5);
    setPage(page + 1);
  };

  useEffect(() => {
    getArticleFeeds(page, 5);
    setPage(page + 1);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (error) {
      message.error("文章加载失败");
    }
  }, [error]);

  return (
    <div>
      <InfiniteScroll
        initialLoad={false}
        pageStart={1}
        loadMore={handleInfiniteLoadMore}
        hasMore={!fetching && hasMore}
      >
        <List
          className={styles.feedList}
          itemLayout="vertical"
          split={false}
          loading={fetching}
          dataSource={articles}
          // tslint:disable-next-line: jsx-no-lambda
          renderItem={(item: IArticle) => (
            <List.Item key={item.id}>
              <Link style={{ width: "100%" }} to={`/articles/${item.alias}`}>
                <FeedCard
                  loading={fetching}
                  image={item.image}
                  title={item.title}
                  abstract={item.abstract}
                  views={item.views}
                  likes={item.likers.length}
                  tags={item.tags}
                  createdAt={item.createdAt}
                />
              </Link>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};

function mapStateToProps(state: IAppState): IArticleFeedPageStateProps {
  return {
    fetching: state.weekly.articles.fetching,
    hasMore: state.weekly.articles.hasMore,
    error: state.weekly.articles.error,
    articles: state.weekly.articles.items,
  };
}

const mapDispatchToProps: IArticleFeedPageDispatchProps = {
  getArticleFeeds,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleFeedPage);
