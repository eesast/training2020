import { Card, Icon } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import styles from "./FeedCard.module.css";

const { Meta } = Card;

export interface IFeedCardProps {
  title: string;
  abstract: string;
  image: string;
  loading: boolean;
  views: number;
  tags: string[];
  likes: number;
  createdAt: string;
}

const FeedCard: React.FC<IFeedCardProps> = (props) => {
  const {
    title,
    abstract,
    image,
    loading,
    views,
    tags,
    likes,
    createdAt,
  } = props;

  const [imgLoading, setImgLoading] = useState(true);
  const handleImageLoad = () => {
    setImgLoading(false);
  };

  const [imgFailLoading, setImgFailLoading] = useState(false);
  const handleImageLoadFail = () => {
    setImgLoading(false);
    setImgFailLoading(true);
  };

  return (
    <Card
      className={styles.card}
      hoverable={true}
      cover={
        <img
          className={styles.cardImage}
          hidden={imgFailLoading}
          alt={title}
          src={axios.defaults.baseURL + image}
          onLoad={handleImageLoad}
          onError={handleImageLoadFail}
        />
      }
      loading={loading || imgLoading}
    >
      <Meta title={title} description={abstract} />
      <div className={styles.flexContainer}>
        <div className={styles.leftToolbar}>
          <div>
            {moment().diff(moment(createdAt), "weeks") < 2
              ? moment(createdAt).fromNow()
              : moment(createdAt).format("L")}
          </div>
          <div style={{ marginLeft: "12px" }}>{tags && tags.join(" / ")}</div>
        </div>
        <div className={styles.rightToolbar}>
          <Icon style={{ marginRight: "6px" }} type="eye" />
          <div style={{ marginRight: "12px" }}>{views || 0}</div>
          <Icon style={{ marginRight: "6px" }} type="like" />
          <div>{likes || 0}</div>
        </div>
      </div>
    </Card>
  );
};

export default FeedCard;
