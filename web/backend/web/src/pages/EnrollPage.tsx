import {
  Button,
  Card,
  Descriptions,
  Form,
  Icon,
  Input,
  message,
  Modal,
} from "antd";
import React, { useEffect } from "react";
import { IAppState, ITeam } from "../redux/types/state";
import { getTeams, getContestId, getSelfTeam } from "../redux/actions/teams";
import { connect } from "react-redux";
import { WithRouterComponent } from "../types/WithRouterComponent";
import { FormComponentProps } from "antd/lib/form";
import { Link, withRouter } from "react-router-dom";
import api from "../api";
import styles from "./EnrollPage.module.css";

interface IEnrollPageStateProps {
  fetching: boolean;
  contestId?: number;
  error?: Error | null;
  teams: ITeam[];
  selfTeam: ITeam;
}

interface IEnrollPageDispatchProps {
  getTeams: (self: boolean, type: string, year: number) => void;
  getContestId: (type: string, year: number) => void;
  getSelfTeam: (type: string, year: number) => void;
}

type IEnrollPageProps = IEnrollPageStateProps & IEnrollPageDispatchProps;

const EnrollPage: React.FC<WithRouterComponent<{}, IEnrollPageProps>> = (
  props
) => {
  const { error, fetching, contestId, selfTeam, getSelfTeam } = props;

  useEffect(() => {
    getSelfTeam("队式", 2020);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!contestId) {
      getContestId("队式", 2020);
    }
  }, [contestId]);

  useEffect(() => {
    if (error) {
      message.error("队伍信息加载失败");
    }
  }, [error]);

  if (selfTeam.id === 0) {
    return (
      <div className={styles.root}>
        <Card className={styles.card}>
          <WrappedEnrollForm contestId={contestId} props={props} />
        </Card>
      </div>
    );
  } else {
    const {
      name,
      description,
      inviteCode,
      leaderInfo,
      membersInfo = [],
    } = selfTeam;

    return (
      <div className={styles.root}>
        <Card className={styles.card} loading={fetching}>
          <Descriptions title="队伍信息" column={4}>
            <Descriptions.Item label="队名">{name}</Descriptions.Item>
            <Descriptions.Item label="邀请码">{inviteCode}</Descriptions.Item>
            <Descriptions.Item label="队长">
              {leaderInfo && leaderInfo.username}
            </Descriptions.Item>
            <Descriptions.Item label="队员">
              {membersInfo &&
                membersInfo.map((member) => member.username).join(", ")}
            </Descriptions.Item>
            <Descriptions.Item label="队伍简介">
              {description}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    );
  }
};

function mapStateToProps(state: IAppState): IEnrollPageStateProps {
  return {
    fetching: state.teams.fetching,
    contestId: state.teams.contestId,
    error: state.teams.error,
    teams: state.teams.items,
    selfTeam: state.teams.selfTeam,
  };
}

const mapDispatchToProps: IEnrollPageDispatchProps = {
  getTeams,
  getSelfTeam,
  getContestId,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EnrollPage)
);

interface IEnrollFormProps extends FormComponentProps {
  props: WithRouterComponent<{}, IEnrollPageProps>;
  contestId?: number;
}

const EnrollForm: React.FC<IEnrollFormProps> = ({ form, props, contestId }) => {
  const { getFieldDecorator } = form;

  const handleSubmit = () => {
    form.validateFields(async (err, values) => {
      if (!err && values.name && values.description) {
        try {
          if (!contestId) {
            getContestId("队式", 2020);
          }

          const inviteCode = await api.createTeam(
            values.name,
            values.description,
            contestId!
          );
          Modal.success({
            title: "队伍创建成功",
            content: <div>邀请码：{inviteCode}</div>,
          });
          props.history.push({ pathname: "/thuedc" });
          props.history.replace({ pathname: "/thuedc/enroll" });
        } catch (error) {
          if (
            error.response.data === "409 Conflict: Team name already exists"
          ) {
            message.error("队伍名称已被注册");
          } else if (
            error.response.data === "409 Conflict: User is already in a team"
          ) {
            message.error("用户已加入队伍");
          } else if (
            error.response.data === "400 Bad Request: Contest not available"
          ) {
            message.error("当前不在报名时间");
          } else if (
            error.response.data === "400 Bad Request: User not in track"
          ) {
            message.error("您没有加入本赛道，请前往主网站加入");
          } else {
            message.error("队伍创建失败");
          }
        }
      }
    });
  };

  return (
    <Form>
      <Form.Item label="队伍名称">
        {getFieldDecorator("name", {
          rules: [{ required: true, message: "请输入队伍名称" }],
        })(
          <Input
            prefix={<Icon type="team" style={{ color: "rgba(0,0,0,.25)" }} />}
            style={{ width: "30%" }}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="on"
          />
        )}
      </Form.Item>
      <Form.Item label="队伍简介">
        {getFieldDecorator("description", {
          rules: [{ required: true, message: "请输入队伍简介" }],
        })(
          <Input.TextArea
            autosize={{ minRows: 5, maxRows: 10 }}
            autoComplete="on"
          />
        )}
      </Form.Item>
      <Form.Item>
        <Link replace to="/thuedc/teams/join" style={{ float: "right" }}>
          加入队伍
        </Link>
      </Form.Item>
      <Form.Item style={{ textAlign: "center" }}>
        <Button type="primary" htmlType="submit" onClick={handleSubmit}>
          创建队伍
        </Button>
      </Form.Item>
    </Form>
  );
};

const WrappedEnrollForm = Form.create<IEnrollFormProps>()(EnrollForm);
