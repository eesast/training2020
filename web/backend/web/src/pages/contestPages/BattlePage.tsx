import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Icon,
  Select,
  Row,
  Col,
  Button,
  Modal,
  Upload,
  message,
  Tag,
  Divider,
  Radio,
} from "antd";
import styles from "./BattlePage.module.css";
import { useSelector, useDispatch } from "react-redux";
import { IAppState, ITeam } from "../../redux/types/state";
import { ICode } from "../../api/codes";
import { getTeams, getSelfTeam, getContestId } from "../../redux/actions/teams";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import api from "../../api";
import { RcCustomRequestOptions } from "antd/lib/upload/interface";
import Clipboard from "clipboard";
import { TableRowSelection } from "antd/es/table";

const { Title, Text } = Typography;

const BattlePage: React.FC = (props) => {
  // redux 数据
  const { teams, selfTeam, contestId, error, fetching } = useSelector(
    (state: IAppState) => {
      return {
        // user: state.auth.user,
        teams: state.teams.items,
        selfTeam: state.teams.selfTeam,
        contestId: state.teams.contestId,
        error: state.teams.error,
        fetching: state.teams.fetching,
        totalTeams: state.teams.totalTeams,
      };
    }
  );
  const dispatch = useDispatch();

  // 本页面的state
  const [codeList, setCodeList] = useState<ICode[]>([]);
  // const [uploadCodeList, setUploadCodeList] = useState<UploadFile[]>([]); // 已上传代码的获取尚未实现
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]); // 选中作为对手的teamId，比赛限制四队，0用于表示bot
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showCompileInfoModal, setShowCompileInfoModal] = useState(false);
  const [showCodeContentModal, setShowCodeContentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showBattleModal, setShowBattleModal] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(true); // 更改以强制重新获取数据
  const [codeRole, setCodeRole] = useState(1); // 代码对应角色
  const [selectedCode, setSelectedCode] = useState<ICode[]>([]); // 选择要编译的代码
  const [showCompileInfo, setShowCompileInfo] = useState(""); // 查看的编译结果
  const [showCodeContent, setShowCodeContent] = useState(""); // 查看的代码内容

  // Table列
  const rankColumns: ColumnProps<ITeam>[] = [
    {
      title: "队伍",
      dataIndex: "name",
      key: "teamName",
    },
    {
      title: "分数",
      dataIndex: "score",
      key: "score",
    },
  ];

  const codeColumns: ColumnProps<ICode>[] = [
    {
      title: "代码名",
      dataIndex: "name",
      key: "codeName",
    },
    {
      title: "编译结果",
      dataIndex: "compileInfo",
      key: "compileInfo",
      render: (info: string) => {
        // 初始 compileInfo === undefined
        if (!info) return <Tag color="cyan">Empty</Tag>;
        return info === "compile success" ? (
          <Tag color="green">Success</Tag>
        ) : (
          <Tag color="red">Failure</Tag>
        );
      },
    },
    {
      title: "语言",
      dataIndex: "language",
      key: "language",
    },
    {
      title: "操作",
      key: "action",
      render: (record: ICode) => {
        return (
          <span>
            <Button
              size="small"
              onClick={() => {
                handleShowCompileInfo(record.compileInfo);
              }}
            >
              编译信息
            </Button>
            <Divider type="vertical" />
            <Button
              size="small"
              onClick={() => {
                handleShowCodeContent(record.content);
              }}
            >
              代码
            </Button>
            <Divider type="vertical" />
            <Button
              size="small"
              onClick={() => {
                handleCodeDelete(record.id);
              }}
            >
              删除
            </Button>
          </span>
        );
      },
    },
  ];

  // 也可以考虑滚动加载的列表展示历史记录
  const historyColumns = [
    {
      title: "比赛结果",
      dataIndex: "result",
      key: "result",
    },
    {
      title: "对战成员",
      dataIndex: "teams",
      key: "teams",
    },
    {
      title: "回放文件",
      dataIndex: "file",
      key: "file",
    },
  ];

  const handlePageChange = (currentPage: number, nextPageSize?: number) => {
    setPageNumber(currentPage);
    if (nextPageSize) setPageSize(nextPageSize);
  };

  const handlePageSizeChange = (current: number, nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPageNumber(current);
  };

  const handleCodeModal = () => {
    setShowCodeModal(!showCodeModal);
  };

  const handleHistoryModal = () => {
    setShowHistoryModal(!showHistoryModal);
  };

  const handleBattleModal = () => {
    setShowBattleModal(!showBattleModal);
  };

  const handleCompileInfoModal = () => {
    setShowCompileInfoModal(false);
    setShowCodeModal(true);
  };

  const handleShowCompileInfo = (compileInfo: string) => {
    if (compileInfo) setShowCompileInfo(compileInfo.replace("#", "\n"));
    else setShowCompileInfo("暂无编译信息");
    setShowCompileInfoModal(true);
    setShowCodeModal(false);
  };

  const handleCodeContentModal = () => {
    setShowCodeContentModal(false);
    setShowCodeModal(true);
  };

  const handleShowCodeContent = (content: string) => {
    if (content) setShowCodeContent(content);
    else setShowCodeContent("暂无编译信息");
    setShowCodeContentModal(true);
    setShowCodeModal(false);
  };

  // antd 文件上传列表受控上传example
  // 可能需要改成先选择，后上传的形式
  // 上传api尚未实现
  // const handleCodeChange = (info: UploadChangeParam<UploadFile<any>>) => {
  //   let fileList = [...info.fileList];
  //   fileList = fileList.slice(-2); // 最后的两个代码文件
  //   fileList = fileList.map((file) => {
  //     if (file.response) {
  //       file.url = file.response.url;
  //     }
  //     return file;
  //   });
  //   setUploadCodeList(fileList);
  // };

  // 调用api将代码存入数据库
  const handleCodeUpload = async (options: RcCustomRequestOptions) => {
    try {
      const response = await api.createCode(
        selfTeam.id,
        contestId!,
        options.file,
        "cpp"
      );
      setForceUpdate(!forceUpdate);
      // 更改上传状态，隐藏上传列表的情况下无显示效果
      if (response.status === 201) {
        options.onSuccess({ response }, options.file);
      }
    } catch (error) {
      options.onError(error);
    }
  };

  // 队伍选择
  const handleSelectedChange = (value: number[]) => {
    if (value.length < 3) {
      setSelectedTeams(value);
    } else {
      setSelectedTeams(value.slice(0, 3));
    }
  };

  const handleBattleStart = async () => {
    await api.startBattle(contestId!, [selfTeam.id, ...selectedTeams], 3005);
    setShowBattleModal(false);
    message.info(`对战已开始，请耐心等待`);
  };

  const handleCodeCompile = async (code: ICode, codeRole: number) => {
    message.info(`正在编译代码${code.name}作为角色${codeRole}`);
    await api.compileCode(code.id, codeRole);
  };

  const handleCodeDelete = async (codeId: number) => {
    await api.deleteCode(codeId);
    setForceUpdate(!forceUpdate);
  };

  useEffect(() => {
    const fetchData = () => {
      dispatch(getTeams(false, "队式", 2020));
      dispatch(getSelfTeam("队式", 2020));
    };

    if (contestId) {
      fetchData();
    } else {
      dispatch(getContestId("队式", 2020));
    }
  }, [contestId, dispatch]);

  useEffect(() => {
    if (error) {
      message.error("信息加载失败");
    }
  }, [error]);

  useEffect(() => {
    const fetchData = async () => {
      const codes = await api.getCodes(contestId!, selfTeam.id, 0, 1);
      setCodeList(codes);
    };

    fetchData();
  }, [contestId, selfTeam, forceUpdate]);

  useEffect(() => {
    const clipboard = new Clipboard("#copyButton", {
      target: () => document.getElementById("codeContent")!,
    });
    clipboard.on("success", () => message.success("复制成功"));
    clipboard.on("error", () => message.error("复制失败"));
    return () => clipboard.destroy();
  });

  const selectChildren = teams.map((team: ITeam) => {
    if (team.id !== selfTeam.id) {
      if (selectedTeams.length === 3 && !selectedTeams.includes(team.id)) {
        return (
          <Select.Option value={team.id} disabled>
            {team.name}
          </Select.Option>
        );
      } else return <Select.Option value={team.id}>{team.name}</Select.Option>;
    }
    return null;
  });

  const rankPagination: PaginationConfig = {
    total: teams.length,
    current: pageNumber,
    pageSize: pageSize,
    showSizeChanger: true,
    onChange: handlePageChange,
    onShowSizeChange: handlePageSizeChange,
    pageSizeOptions: ["5", "10", "20"],
  };

  const codeSelctionConfig: TableRowSelection<ICode> = {
    type: "radio",
    onChange: (selectKeys, selectRows) => {
      setSelectedCode([selectRows[0]]);
    },
  };

  return (
    <div className={styles.root}>
      <div style={{ width: "80%" }}>
        {/* 选择比赛用的代码，介绍对战，选择对手 */}
        <Row gutter={16} align="middle" type="flex" justify="space-between">
          <Col span={12}>
            <Typography>
              <Title level={4}>Tips</Title>
              <Text strong>代码管理</Text>
              <br />
              两个角色，各一份代码。我们只会保留最新的一整份代码供操作。
              <br />
              <Text strong>历史记录</Text>
              <br />
              历次对战的结果和回放文件。
              <br />
              <Text strong>对战</Text>
              <br />
              每场比赛支持最多四支队伍同时对战
            </Typography>
          </Col>
          <Col span={12}>
            <Row gutter={[16, 16]} justify="end">
              <Col span={24}>
                <Button icon="code" size="large" onClick={handleCodeModal}>
                  代码管理
                </Button>
              </Col>
            </Row>
            <Row gutter={[16, 16]} justify="end">
              <Col span={24}>
                <Button
                  icon="history"
                  size="large"
                  onClick={handleHistoryModal}
                >
                  历史记录
                </Button>
              </Col>
            </Row>
            <Row gutter={[16, 16]} justify="end">
              <Col span={24}>
                <Button
                  icon="thunderbolt"
                  size="large"
                  type="primary"
                  onClick={handleBattleModal}
                >
                  开始游戏
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <Table
        className={styles.list}
        columns={rankColumns}
        dataSource={teams.slice(
          (pageNumber - 1) * pageSize,
          pageNumber * pageSize
        )}
        pagination={rankPagination}
        loading={fetching}
      />
      <Modal
        title="代码管理"
        width="40%"
        visible={showCodeModal}
        closable
        footer={null}
        onCancel={handleCodeModal}
      >
        <Row justify="space-between">
          <Col span={8}>
            <Upload
              fileList={[]} // 暂不考虑文件上传列表展示
              // onChange={handleCodeChange}
              customRequest={handleCodeUpload}
            >
              <Button>
                <Icon type="upload" theme="outlined" /> 上传代码
              </Button>
            </Upload>
          </Col>
          <Col span={8}>
            AI角色
            <Radio.Group
              value={codeRole}
              onChange={(event) => {
                setCodeRole(event.target.value);
              }}
            >
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
            </Radio.Group>
          </Col>
          <Col span={4}></Col>
          <Col span={4}>
            <Button
              type="primary"
              onClick={() => {
                handleCodeCompile(selectedCode[0], codeRole);
                message.info("编译需要一段时间，请稍后刷新以查看");
              }}
            >
              编译
            </Button>
          </Col>
        </Row>
        <Table
          columns={codeColumns}
          dataSource={codeList}
          rowSelection={codeSelctionConfig}
          pagination={false}
        />
      </Modal>

      <Modal
        visible={showCompileInfoModal}
        title="编译结果"
        closable
        footer={null}
        onCancel={handleCompileInfoModal}
      >
        <div style={{ whiteSpace: "pre" }}>{showCompileInfo}</div>
      </Modal>

      <Modal
        visible={showCodeContentModal}
        title="代码"
        closable
        footer={null}
        onCancel={handleCodeContentModal}
      >
        <Button id="copyButton">复制代码</Button>
        <div style={{ whiteSpace: "pre" }} id="codeContent">
          {showCodeContent}
        </div>
      </Modal>

      <Modal
        visible={showHistoryModal}
        title="历史记录"
        closable
        footer={null}
        onCancel={handleHistoryModal}
      >
        <Table className={styles.list} columns={historyColumns} />
      </Modal>

      <Modal
        visible={showBattleModal}
        title="对战准备"
        closable
        footer={null}
        onCancel={handleBattleModal}
      >
        <Row gutter={16}>
          <Col span={20}>
            <Select
              mode="multiple"
              size="large"
              style={{ width: "100%" }}
              value={selectedTeams}
              onChange={handleSelectedChange}
            >
              {selectChildren}
            </Select>
          </Col>
          <Col span={4}>
            <Button type="primary" size="large" onClick={handleBattleStart}>
              Start
            </Button>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default BattlePage;
