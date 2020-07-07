import { message, List, Button, Collapse, Empty } from "antd";
import React, { useState, useEffect } from "react";
import moment from "moment";
import DOMPurify from "dompurify";
import marked from "marked";
import styles from "./ResourcePage.module.css";
import { IAnnouncement, getAnnouncements } from "../api/announcements";
import { getContestId } from "../redux/actions/teams";
import { connect } from "react-redux";
import { IAppState } from "../redux/types/state";

const { Panel } = Collapse;
marked.setOptions({
  sanitize: true,
  sanitizer: DOMPurify.sanitize,
});

interface IResourcePageStateProps {
  contestId?: number;
  error?: Error | null;
}

interface IResourcePageDispatchProps {
  getContestId: (type: string, year: number) => void;
}

type IResourcePageProps = IResourcePageStateProps & IResourcePageDispatchProps;

const ResourcePage: React.FC<IResourcePageProps> = (props) => {
  const { contestId, error, getContestId } = props;

  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    if (error) {
      message.error("公告加载失败");
    }
  }, [error]);

  useEffect(() => {
    if (!contestId) {
      getContestId("队式", 2020);
    }
  }, [contestId, getContestId]);

  const getMoreAnnouncements = async () => {
    setLoading(true);

    let newAnnouncements: IAnnouncement[] = [];
    try {
      if (!contestId) {
        getContestId("队式", 2020);
      }
      newAnnouncements = await getAnnouncements(
        page * 5,
        (page + 1) * 5 - 1,
        contestId!
      );
    } catch {
      message.error("公告加载失败");
    }

    setLoading(false);

    if (newAnnouncements.length === 0) {
      message.info("无更多公告");
      return;
    }

    setAnnouncements((announcements) => announcements.concat(newAnnouncements));
    setPage(page + 1);
  };

  useEffect(() => {
    if (contestId) {
      getMoreAnnouncements();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contestId]);

  return (
    <div className={styles.root}>
      <List
        loading={loading}
        itemLayout="horizontal"
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={"暂无公告"}
            />
          ),
        }}
        split={false}
        dataSource={announcements}
        className={styles.list}
        renderItem={(item: IAnnouncement) => (
          <List.Item>
            <Collapse className={styles.collapse} defaultActiveKey={["1"]}>
              <Panel
                header={(item.priority > 1 ? "【重要】" : "") + item.title}
                key="1"
                extra={`发布时间：${moment(item.createdAt).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}`}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: marked(item.content) }}
                />
              </Panel>
            </Collapse>
          </List.Item>
        )}
      />
      <Button onClick={getMoreAnnouncements}>查看更多公告</Button>
    </div>
  );
};

function mapStateToProps(state: IAppState): IResourcePageStateProps {
  return {
    contestId: state.teams.contestId,
    error: state.teams.error,
  };
}

const mapDispatchToProps: IResourcePageDispatchProps = {
  getContestId,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResourcePage);
