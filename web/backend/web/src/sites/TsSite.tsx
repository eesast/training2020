import { Icon, Layout, Menu } from "antd";
import { MenuProps } from "antd/lib/menu";
import React, { useState, useEffect } from "react";
import {
  Link,
  Route,
  RouteComponentProps,
  Switch,
  Redirect,
  useRouteMatch,
  useLocation,
} from "react-router-dom";
import { Site } from "../App";
import styles from "./EdcSite.module.css";
import IntroPage from "../pages/IntroPage";
import NotFoundSite from "./NotFoundSite";
import EnrollPage from "../pages/EnrollPage";
import TeamManagePage from "../pages/TeamManagePage";
import ResourcePage from "../pages/ResourcePage";
import TeamJoinPage from "../pages/TeamJoinPage";
import BattlePage from "../pages/contestPages/BattlePage";
import TokenVerifyPage from "../pages/TokenVerifyPage";
// import SponsorPage from "../pages/SponsorPage";
import AuthRoute from "../components/AuthRoute";

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

export interface ITsSiteProps {
  setSite: (site: Site) => void;
}

type Page =
  | "intro"
  | "enroll"
  | "teamJoin"
  | "teamManage"
  | "resource"
  | "battle"
  | "sponsor";

const routes: { to: string; key: Page }[] = [
  { to: "/intro", key: "intro" },
  { to: "/enroll", key: "enroll" },
  { to: "/teams/manage", key: "teamManage" },
  { to: "/teams/join", key: "teamJoin" },
  { to: "/resources", key: "resource" },
  { to: "/battle", key: "battle" },
  { to: "/sponsor", key: "sponsor" },
];

const TsSite: React.FC<ITsSiteProps> = (props) => {
  const { setSite } = props;
  const [page, setPage] = useState<Page>("intro");

  const match = useRouteMatch();
  const location = useLocation();

  const homeRoute = () => {
    return <Redirect to={"/teamstyle/intro"} push />;
  };

  const NotFoundPage = (props: RouteComponentProps<any>) => (
    <NotFoundSite {...props} setSite={setSite} />
  );

  const onMenuSelect: MenuProps["onSelect"] = (item) =>
    setPage(item.key as Page);

  useEffect(() => {
    setSite("ts");
  }, [setSite]);

  useEffect(() => {
    const pathname = location!.pathname.substring(
      location!.pathname.indexOf("/", 1)
    );
    const matchedRoute = routes.find((item) => pathname === item.to);
    if (matchedRoute) {
      setPage(matchedRoute.key);
    }
  }, [location]);

  return (
    <Layout>
      <Sider breakpoint="sm" collapsedWidth="0" theme="light">
        <Menu
          theme="light"
          mode="inline"
          defaultOpenKeys={["team"]}
          selectedKeys={[page]}
          onSelect={onMenuSelect}
        >
          <Menu.Item key="intro">
            <Link to={`${match.url}/intro`} replace />
            <Icon type="home" theme="outlined" />
            介绍
          </Menu.Item>
          <Menu.Item key="resource">
            <Link to={`${match.url}/resources`} replace />
            <Icon type="database" theme="outlined" />
            资源与公告
          </Menu.Item>
          <Menu.Item key="enroll">
            <Link to={`${match.url}/enroll`} replace />
            <Icon type="form" theme="outlined" />
            报名
          </Menu.Item>
          <SubMenu
            key="team"
            title={
              <span>
                <Icon type="team" theme="outlined" />
                队伍
              </span>
            }
          >
            <Menu.Item key="teamJoin">
              <Link to={`${match.url}/teams/join`} replace />
              加入
            </Menu.Item>
            <Menu.Item key="teamManage">
              <Link to={`${match.url}/teams/manage`} replace />
              管理
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="battle">
            <Link to={`${match.url}/battle`} replace />
            <Icon type="thunderbolt" theme="outlined" />
            对战
          </Menu.Item>
          {/* <Menu.Item key="sponsor">
            <Link to={`${match.url}/sponsor`} replace />
            <Icon type="heart" theme="outlined"/>
            赞助商
          </Menu.Item> */}
        </Menu>
      </Sider>
      <Content className={styles.content}>
        <Switch location={location}>
          <Route exact path={`${match.path}`} render={homeRoute} />
          <Route exact path={`${match.path}/intro`} component={IntroPage} />
          <AuthRoute
            location={location}
            path={`${match.path}/enroll`}
            component={EnrollPage}
          />
          <AuthRoute
            location={location}
            path={`${match.path}/teams/manage`}
            component={TeamManagePage}
          />
          <AuthRoute
            location={location}
            path={`${match.path}/teams/join`}
            component={TeamJoinPage}
          />
          <AuthRoute
            location={location}
            path={`${match.path}/battle`}
            component={BattlePage}
          />
          <Route
            exact
            path={`${match.path}/resources`}
            component={ResourcePage}
          />
          {/* <Route exact path={`${match.path}/sponsor`} component={SponsorPage} /> */}
          <Route
            exact
            path={`${match.path}/token/:token`}
            component={TokenVerifyPage}
          />
          <Route component={NotFoundPage} />
        </Switch>
      </Content>
    </Layout>
  );
};

export default TsSite;
