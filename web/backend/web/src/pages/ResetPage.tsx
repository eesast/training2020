import React, { useEffect, useState } from "react";
import { WithRouterComponent } from "../types/WithRouterComponent";
import styles from "./ResetPage.module.css";
import { Card, Typography, Input, Button, Spin, Result, message } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import { InputProps } from "antd/lib/input";
import { ButtonProps } from "antd/lib/button";
import jwtDecode from "jwt-decode";
import { IUser } from "../redux/types/state";

const ResetPage: React.FC<WithRouterComponent<{ token: string }, {}>> = ({
  location,
  history,
}) => {
  const token = location.pathname.substr(
    location.pathname.lastIndexOf("/") + 1
  );

  const [input, setInput] = useState("");

  const [emailSent, setEmailSent] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token !== "reset") {
      (async () => {
        try {
          await axios.get("/v1/users/reset/" + token);
          setVerified(true);
        } catch {
          setVerified(false);
        }
      })();
    }
  }, [token]);

  const handleInput: InputProps["onChange"] = (e) => {
    setInput(e.target.value);
  };

  const handleResetSubmit: ButtonProps["onClick"] = async (e) => {
    e.preventDefault();

    if (!input) {
      message.error("请完整输入信息");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/v1/users/reset", {
        email: input,
        action: "get",
      });
      setEmailSent(true);
    } catch {
      message.error("用户不存在");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword: ButtonProps["onClick"] = async (e) => {
    e.preventDefault();

    if (!input) {
      message.error("请完整输入信息");
      return;
    }

    const decoded = jwtDecode(token) as IUser;
    try {
      setLoading(true);
      await axios.post("/v1/users/reset", {
        email: decoded.email,
        password: input,
        action: "set",
        token,
      });
      message.success("密码重置成功");
      history.replace("/home");
    } catch {
      message.error("网络错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      {token === "reset" ? (
        emailSent ? (
          <Result
            status="success"
            title="重置密码邮件发送成功"
            subTitle="若长时间未收到邮件，请检查邮件垃圾箱"
            extra={[
              <Button type="primary">
                <Link to="/home">返回首页</Link>
              </Button>,
            ]}
          />
        ) : (
          <Card className={styles.card}>
            <Typography.Title style={{ marginTop: 24 }} level={4}>
              重置密码
            </Typography.Title>
            <Input
              style={{ marginTop: 24, width: 300 }}
              placeholder="请输入注册时使用的邮箱"
              onChange={handleInput}
            />
            <Button
              style={{ margin: 24 }}
              onClick={handleResetSubmit}
              loading={loading}
            >
              获取重置链接
            </Button>
          </Card>
        )
      ) : verified === true ? (
        <Card className={styles.card}>
          <Typography.Title style={{ marginTop: 24 }} level={4}>
            重置密码
          </Typography.Title>
          <Input.Password
            style={{ marginTop: 24, width: 300 }}
            placeholder="请输入新密码"
            onChange={handleInput}
          />
          <Button
            style={{ margin: 24 }}
            onClick={handleResetPassword}
            loading={loading}
          >
            重置
          </Button>
        </Card>
      ) : verified === false ? (
        <Result
          status="404"
          title="404"
          subTitle="您所访问的页面不存在"
          extra={
            <Button type="primary">
              <Link to="/home">返回首页</Link>
            </Button>
          }
        />
      ) : (
        <Spin />
      )}
    </div>
  );
};

export default ResetPage;
