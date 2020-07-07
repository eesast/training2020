import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Table,
  Descriptions,
} from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import api from "../api";
import { WithRouterComponent } from "../types/WithRouterComponent";
import { IAppState, ITeam, IUser } from "../redux/types/state";
import {
  getTeams,
  getSelfTeam,
  getContestId,
  getTeamNum,
} from "../redux/actions/teams";
import styles from "./TeamJoinPage.module.css";

import { FormComponentProps } from "antd/lib/form";
import { PaginationConfig, SortOrder } from "antd/lib/table";
import { ColumnProps } from "antd/es/table";

interface ITeamJoinPageStateProps {
  loggedIn: boolean;
  fetching: boolean;
  contestId?: number;
  user: IUser;
  teams: ITeam[];
  selfTeam: ITeam;
  totalTeams: number;
  error?: Error | null;
}

interface ITeamJoinPageDispatchProps {
  getTeams: (
    self: boolean,
    type: string,
    year: number,
    begin?: number,
    end?: number
  ) => void;
  getTeamNum: (type: string, year: number) => void;
  getSelfTeam: (type: string, year: number) => void;
  getContestId: (type: string, year: number) => void;
}

type ITeamJoinPageProps = ITeamJoinPageStateProps & ITeamJoinPageDispatchProps;

const TeamJoinPage: React.FC<WithRouterComponent<{}, ITeamJoinPageProps>> = (
  props
) => {
  const {
    user,
    teams,
    selfTeam,
    getTeams,
    getSelfTeam,
    totalTeams,
    getTeamNum,
    contestId,
    getContestId,
    error,
    fetching,
  } = props;

  const [visible, setVisible] = useState(false);
  const [teamId, setTeamId] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [activeRow, setActiveRow] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (contestId) {
      getSelfTeam("队式", 2020);
      getTeamNum("队式", 2020);
    } else {
      getContestId("队式", 2020);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contestId]);

  useEffect(() => {
    const fetchData = async () => {
      await getTeams(
        false,
        "电设",
        2019,
        (pageNumber - 1) * pageSize,
        pageNumber * pageSize
      );
    };
    if (contestId) {
      fetchData();
    } else {
      getContestId("队式", 2020);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contestId, pageNumber, pageSize]);

  useEffect(() => {
    if (error) {
      message.error("队伍信息加载失败");
    }
  }, [error]);

  useEffect(() => {
    if (exporting) {
      try {
        const teamsData = teams.reduce(
          (data: (string | number)[][], team) =>
            data.concat(
              team.membersInfo!.map((member) => [
                team.name,
                member.name,
                member.id,
              ])
            ),
          []
        );
        (async () => {
          const xlsx = await import("xlsx");
          const workBook = xlsx.utils.book_new();
          const workSheet = xlsx.utils.aoa_to_sheet(teamsData);

          xlsx.utils.book_append_sheet(workBook, workSheet, "helloWorld");
          xlsx.writeFile(workBook, "队伍信息.xlsx");
        })();
      } catch (error) {
        message.error("队伍信息导出失败");
      }
      setExporting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams]);

  const changePage = (currentPage: number, nextPageSize?: number) => {
    setPageNumber(currentPage);
    if (nextPageSize) setPageSize(nextPageSize);
  };

  const changePageSize = (current: number, nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPageNumber(current);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleJoin = () => {
    setVisible(false);
  };

  const exportTeams = () => {
    setExporting(true);
    getTeams(false, "队式", 2020);
  };

  // const handleChange = (pagination: PaginationConfig) => {
  // 这是table本身用于处理分页、筛选时的回调
  // 由于分页已经单独拿出来实现，此函数暂时无用
  // 以后添加新功能可能会用上，暂且留为注释
  // };

  const handleClick = (record: ITeam) => {
    if (activeRow === String(record.id)) setActiveRow("");
    else setActiveRow(String(record.id));
  };

  const handleExpand = (expanded: boolean, record: ITeam) => {
    if (activeRow === String(record.id)) setActiveRow("");
    else setActiveRow(String(record.id));
  };

  const sortDir: SortOrder[] = ["descend", "ascend"];

  const columns: ColumnProps<ITeam>[] = [
    {
      title: "队伍名称",
      dataIndex: "name",
      key: "name",
      width: "30%",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: sortDir,
    },
    {
      title: "队长",
      dataIndex: "leaderInfo",
      key: "leaderInfo",
      render: (leader: IUser) => leader.username,
      width: "30%",
    },
    {
      title: "队伍成员",
      dataIndex: "membersInfo",
      key: "membersInfo",
      render: (members?: IUser[]) =>
        members
          ? members.map((member: IUser) => member.username).join("、")
          : "",
    },
  ];

  const pagination: PaginationConfig = {
    total: totalTeams,
    current: pageNumber,
    pageSize: pageSize,
    showSizeChanger: true,
    onChange: changePage,
    onShowSizeChange: changePageSize,
    pageSizeOptions: ["5", "10", "20"],
    showTotal: (total: number) => (
      <div style={{ display: "inline-block" }}>
        {`总共${total}支队伍`}
        {(user.role === "root" || user.role === "organizer") && (
          <Button
            style={{ marginLeft: "20px" }}
            onClick={exportTeams}
            type="primary"
            shape="round"
            icon="download"
            size="small"
          >
            导出队伍信息
          </Button>
        )}
      </div>
    ),
  };

  return (
    <div className={styles.root}>
      <Table
        className={styles.list}
        columns={columns}
        dataSource={teams}
        loading={fetching}
        pagination={pagination}
        rowKey={(record: ITeam) => String(record.id)}
        expandedRowKeys={[activeRow]}
        //onChange={handleChange}
        expandRowByClick
        onExpand={handleExpand}
        onRowClick={handleClick}
        expandedRowRender={(record: ITeam) => (
          <div>
            <Descriptions>
              <Descriptions.Item label="队伍简介">
                {record.description}
              </Descriptions.Item>
            </Descriptions>

            <Popover
              content={
                selfTeam.id !== 0 ? (
                  <div>
                    您已加入队伍
                    <br />
                    <Link replace to="/thuedc/teams/manage">
                      转到所属队伍
                    </Link>
                  </div>
                ) : record.members.length === 4 ? (
                  "队伍成员已满"
                ) : (
                  "点击按钮现在加入队伍"
                )
              }
            >
              <Button
                type="primary"
                disabled={
                  (record.members.length === 4 && selfTeam.id === 0) ||
                  (selfTeam.id !== 0 && selfTeam.id !== record.id)
                }
                onClick={() => {
                  if (selfTeam.id === 0) {
                    setTeamId(record.id);
                    showModal();
                  }
                }}
              >
                加入队伍
              </Button>
            </Popover>
          </div>
        )}
      />

      <WrappedTeamJoinForm
        teamId={teamId}
        id={user.id}
        visible={visible}
        onCancel={handleCancel}
        onJoin={handleJoin}
      />
    </div>
  );
};

function mapStateToProps(state: IAppState): ITeamJoinPageStateProps {
  return {
    loggedIn: state.auth.loggedIn,
    fetching: state.teams.fetching,
    contestId: state.teams.contestId,
    user: state.auth.user!,
    error: state.teams.error,
    teams: state.teams.items,
    selfTeam: state.teams.selfTeam,
    totalTeams: state.teams.totalTeams,
  };
}

const mapDispatchToProps: ITeamJoinPageDispatchProps = {
  getTeams,
  getTeamNum,
  getSelfTeam,
  getContestId,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TeamJoinPage)
);

interface ITeamJoinFormProps extends FormComponentProps {
  teamId: number;
  id: number;
  visible: boolean;
  onCancel: () => void;
  onJoin: () => void;
}

const TeamJoinForm: React.FC<ITeamJoinFormProps> = ({
  teamId,
  id,
  form,
  visible,
  onCancel,
}) => {
  const { getFieldDecorator } = form;

  const handleSubmit = () => {
    form.validateFields(async (err, values) => {
      if (!err && values.inviteCode) {
        try {
          await api.addTeamMember(teamId, id, values.inviteCode);
          onCancel();
          Modal.info({
            title: "队伍加入成功",
          });
        } catch (error) {
          if (error.response.data === "403 Forbidden: Incorrect invite code") {
            message.error("您填写的邀请码有误");
          } else if (
            error.response.data ===
            "409 Conflict: The number of members exceeds"
          ) {
            message.error("您想加入的队伍人数已达限制");
          } else if (
            error.response.data === "409 Conflict: User is already in a team"
          ) {
            message.error("您已加入一支队伍");
          } else if (
            error.response.data === "400 Bad Request: Contest not available"
          ) {
            message.error("当前不在报名时间");
          } else if (
            error.response.data === "400 Bad Request: User not in track"
          ) {
            message.error("您没有加入本赛道，请前往主网站加入");
          } else {
            message.error("加入队伍失败，请联系管理员");
          }
        }
      }
    });
  };

  return (
    <Modal
      title="输入邀请码以加入队伍"
      okText="加入"
      okType="primary"
      visible={visible}
      onCancel={onCancel}
      onOk={() => {
        handleSubmit();
      }}
    >
      <Form layout="vertical">
        <Form.Item label="inviteCode">
          {getFieldDecorator("inviteCode", {
            rules: [{ required: true, message: "请输入邀请码" }],
          })(<Input />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const WrappedTeamJoinForm = Form.create<ITeamJoinFormProps>()(TeamJoinForm);
