import {
  BackTop,
  Button,
  Layout,
  ConfigProvider,
  Menu,
  Typography,
} from "antd";
import zhCN from "antd/es/locale/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
import QueueAnim from "rc-queue-anim";
import React, { useState } from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
  Switch,
} from "react-router-dom";
import logo from "./assets/logo.png";
import LoginPage from "./pages/LoginPage";
import store from "./redux/store";
import ApiSite from "./sites/ApiSite";
import EdcSite from "./sites/EdcSite";
import TsSite from "./sites/TsSite";
import HomeSite from "./sites/HomeSite";
import NotFoundSite from "./sites/NotFoundSite";
import WeeklySite from "./sites/WeeklySite";
import MarkdownSite from "./sites/MarkdownSite";
import styles from "./App.module.css";
import { MenuProps } from "antd/lib/menu";
import RegisterPage from "./pages/RegisterPage";
import ResetPage from "./pages/ResetPage";
import ProfilePage from "./pages/ProfilePage";
import AuthRoute from "./components/AuthRoute";

const { Header, Footer } = Layout;
const { Title } = Typography;

moment.locale("zh-cn");

export type Site = "home" | "weekly" | "edc" | "ts" | "others";

const App = () => {
  const getRoute = ({ location }: RouteProps) => {
    const pathname = "/" + location!.pathname.split("/")[1];
    const matchedRoute = routes.find((item) => pathname === item.to);
    const Component = matchedRoute ? matchedRoute.component : NotFoundSite;
    const authRequired = matchedRoute && matchedRoute.auth;

    const homeRoute = () => <Redirect to="/home" />;
    const siteRoute = (props: RouteComponentProps<any>) => (
      <Component {...props} setSite={setSite} />
    );

    return (
      <div style={{ position: "relative" }}>
        <Switch location={location}>
          <Route exact={true} path="/" render={homeRoute} />
          <QueueAnim type={["right", "left"]}>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
              key={pathname}
            >
              {authRequired ? (
                <AuthRoute
                  location={location}
                  path="/:url"
                  component={Component}
                />
              ) : (
                <Route location={location} path="/:url" render={siteRoute} />
              )}
              <Footer className={styles.footer}>© 2020 EESAST</Footer>
            </div>
          </QueueAnim>
        </Switch>
      </div>
    );
  };

  const [site, setSite] = useState<Site>("home");

  const onHeaderMenuSelect: MenuProps["onSelect"] = (item) =>
    setSite(item.key as Site);

  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <Router>
          <Layout>
            <Header className={styles.header}>
              <div className={styles.logoContainer}>
                <img className={styles.logo} src={logo} alt="logo" />
                <Title style={{ margin: "auto", marginLeft: 10 }} level={3}>
                  EESΛST
                </Title>
              </div>
              <Menu
                className={styles.menu}
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={["home"]}
                selectedKeys={[site]}
                onSelect={onHeaderMenuSelect}
              >
                <Menu.Item key="home">
                  <Link to="/home">首页</Link>
                </Menu.Item>
                <Menu.Item key="weekly">
                  <Link to="/weekly">Weekly</Link>
                </Menu.Item>
                <Menu.Item key="ts">
                  <Link to="/teamstyle">队式程序设计比赛</Link>
                </Menu.Item>
                <Menu.Item key="info">
                  <a href="https://info.eesast.com">Info</a>
                </Menu.Item>
              </Menu>
              <div className={styles.toolbar}>
                <Link to="/profile">
                  <Button icon="user" />
                </Link>
              </div>
            </Header>
            <Route render={getRoute} />
          </Layout>
          <BackTop />
        </Router>
      </ConfigProvider>
    </Provider>
  );
};

const routes = [
  { to: "/home", component: HomeSite, auth: false },
  { to: "/weekly", component: WeeklySite, auth: false },
  { to: "/thuedc", component: EdcSite, auth: false },
  { to: "/teamstyle", component: TsSite, auth: false },
  { to: "/api", component: ApiSite, auth: false },
  { to: "/md2wx", component: MarkdownSite, auth: false },
  { to: "/login", component: LoginPage, auth: false },
  { to: "/profile", component: ProfilePage, auth: true },
  { to: "/register", component: RegisterPage, auth: false },
  { to: "/reset", component: ResetPage, auth: false },
];

export default App;
