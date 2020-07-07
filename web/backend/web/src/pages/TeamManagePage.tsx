import React, { useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { IAppState, ITeam, IUser } from "../redux/types/state";
import { connect } from "react-redux";
import { FormComponentProps } from "antd/lib/form";
import { getTeams, getContestId, getSelfTeam } from "../redux/actions/teams";
import {
  message,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Checkbox,
  Modal,
  Result,
} from "antd";
import { WithRouterComponent } from "../types/WithRouterComponent";
import api from "../api";
import styles from "./TeamManagePage.module.css";

interface ITeamManagePageStateProps {
  teams: ITeam[];
  selfTeam: ITeam;
  user: IUser;
  contestId?: number;
  error?: Error | null;
}

interface ITeamManagePageDispatchProps {
  getTeams: (self: boolean, type: string, year: number) => void;
  getSelfTeam: (type: string, year: number) => void;
  getContestId: (type: string, year: number) => void;
}

type ITeamManagePageProps = ITeamManagePageDispatchProps &
  ITeamManagePageStateProps;

const TeamManagePage: React.FC<WithRouterComponent<
  {},
  ITeamManagePageProps
>> = (props) => {
  const { contestId, error, selfTeam, getSelfTeam } = props;

  useEffect(() => {
    getSelfTeam("队式", 2020);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      message.error("队伍信息加载失败");
    }
  }, [error]);

  if (selfTeam.id === 0) {
    return (
      <div className={styles.root}>
        <Result
          status="warning"
          icon={<Icon type="frown" theme="twoTone" />}
          title="您还没有加入任何队伍"
          extra={
            <Button type="primary">
              <Link replace to="/thuedc/teams/join">
                加入队伍
              </Link>
            </Button>
          }
        />
      </div>
    );
  } else {
    return (
      <div className={styles.root}>
        <Card className={styles.card}>
          <WrappedTeamManageForm contestId={contestId} props={props} />
        </Card>
      </div>
    );
  }
};

function mapStateToProps(state: IAppState): ITeamManagePageStateProps {
  return {
    teams: state.teams.items,
    user: state.auth.user!,
    contestId: state.teams.contestId,
    error: state.teams.error,
    selfTeam: state.teams.selfTeam,
  };
}

const mapDispatchToProps: ITeamManagePageDispatchProps = {
  getTeams,
  getContestId,
  getSelfTeam,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TeamManagePage)
);

interface ITeamManageFormProps extends FormComponentProps {
  props: WithRouterComponent<{}, ITeamManagePageProps>;
  contestId?: number;
}

const TeamManageForm: React.FC<ITeamManageFormProps> = ({
  form,
  props,
  contestId,
}) => {
  const {
    id,
    name,
    description,
    inviteCode,
    leader,
    leaderInfo,
    members = [],
    membersInfo = [],
  } = props.selfTeam;

  const isLeader = props.user.id === leader;

  const { getFieldDecorator } = form;

  const getMemberOptions = () => {
    let options = [];
    for (let i = 0; i < members.length; i++) {
      if (members[i] === leader) {
        options.push({
          label: membersInfo[i].username,
          value: members[i],
          disabled: true,
        });
      } else {
        options.push({
          label: membersInfo[i].username,
          value: members[i],
        });
      }
    }
    return options;
  };

  const handleSubmit = () => {
    form.validateFields(async (err, values) => {
      if (!err && values.name && values.description && values.members) {
        try {
          if (!contestId) {
            props.getContestId("队式", 2020);
          }

          await api.updateTeam(
            id,
            values.name,
            values.description,
            contestId!,
            values.members
          );
          Modal.success({
            title: "队伍信息已修改",
            content: "请确认修改后的信息",
          });
          getTeams(true, "队式", 2020);
        } catch (error) {
          if (
            error.response.data === "409 Conflict: Team name already exists"
          ) {
            message.error("队伍名称已被注册");
          } else if (
            error.response.data ===
            "400 Bad Request: Captain is not a member of the team"
          ) {
            message.error("队长需要在队伍中");
          } else if (
            error.response.data === "400 Bad Request: Contest not available"
          ) {
            message.error("当前不在报名时间");
          } else {
            message.error("队伍信息修改失败");
          }
        }
      }
    });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "您确认要解散队伍吗？",
      content: "解散后队伍将被删除，且该操作不可逆",
      async onOk() {
        try {
          await api.deleteTeam(id);
          getTeams(true, "队式", 2020);
          Modal.success({
            title: "队伍已解散",
            content: "请重新加入队伍",
          });
          props.history.push({ pathname: "/thuedc" });
          props.history.replace({ pathname: "/thuedc/teams/join" });
        } catch (error) {
          if (error.response.data === "401 Unauthorized: Permission denied") {
            message.error("您没有权限进行该操作");
          } else {
            message.error("删除队伍失败");
          }
        }
      },
      onCancel() {},
    });
  };

  const handleQuit = () => {
    Modal.confirm({
      title: "您确认要退出队伍吗？",
      content: "不在任何队伍中代表您放弃了本次比赛",
      async onOk() {
        try {
          await api.quitTeam(id, props.user.id);
          getTeams(true, "队式", 2020);
          Modal.success({
            title: "您已退出队伍",
            content: "请重新加入队伍",
          });
          props.history.push({ pathname: "/thuedc" });
          props.history.replace({ pathname: "/thuedc/teams/join" });
        } catch (error) {
          if (error.response.data === "401 Unauthorized: Permission denied") {
            message.error("您没有权限进行该操作");
          } else {
            message.error("退出队伍失败");
          }
        }
      },
      onCancel() {},
    });
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  return (
    <Form {...formItemLayout}>
      <Form.Item label="队伍名称">
        {getFieldDecorator("name", {
          rules: [{ required: true, message: "请输入队伍名称!" }],
          initialValue: name,
        })(
          <Input
            prefix={<Icon type="team" style={{ color: "rgba(0,0,0,.25)" }} />}
            style={{ width: "30%" }}
            disabled={!isLeader}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="on"
          />
        )}
      </Form.Item>
      <Form.Item label="邀请码">
        <span>{inviteCode}</span>
      </Form.Item>
      <Form.Item label="队长">
        <span>{leaderInfo && leaderInfo.username}</span>
      </Form.Item>
      <Form.Item label="队员">
        {getFieldDecorator("members", {
          initialValue: members,
        })(
          <Checkbox.Group options={getMemberOptions()} disabled={!isLeader} />
        )}
      </Form.Item>
      <Form.Item label="队伍简介">
        {getFieldDecorator("description", {
          rules: [{ required: true, message: "请输入队伍简介!" }],
          initialValue: description,
        })(
          <Input.TextArea
            autosize={{ minRows: 5, maxRows: 10 }}
            autoComplete="on"
            disabled={!isLeader}
          />
        )}
      </Form.Item>
      <Form.Item style={{ textAlign: "center" }}>
        <Button type="primary" onClick={handleSubmit} disabled={!isLeader}>
          确认修改
        </Button>
        <Button
          type="danger"
          style={{ marginLeft: 8 }}
          onClick={isLeader ? handleDelete : handleQuit}
        >
          {isLeader ? "解散队伍" : "退出队伍"}
        </Button>
      </Form.Item>
    </Form>
  );
};

const WrappedTeamManageForm = Form.create<ITeamManageFormProps>()(
  TeamManageForm
);
