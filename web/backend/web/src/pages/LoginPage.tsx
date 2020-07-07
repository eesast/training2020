import { Button, Card, Form, Icon, Input, message } from "antd";
import { FormComponentProps } from "antd/lib/form";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import logo from "../assets/logo.png";
import { login } from "../redux/actions/auth";
import { IAppState } from "../redux/types/state";
import { WithRouterComponent } from "../types/WithRouterComponent";
import styles from "./LoginPage.module.css";
import { Link } from "react-router-dom";

interface ILoginPageStateProps {
  loggedIn: boolean;
  loggingIn: boolean;
  error?: Error | null;
}

interface ILoginPageDispatchProps {
  login: (username: string, password: string) => void;
}

type ILoginPageProps = ILoginPageStateProps & ILoginPageDispatchProps;

const LoginPage: React.FC<WithRouterComponent<{}, ILoginPageProps>> = (
  props
) => {
  const { login, loggingIn, loggedIn, error, history } = props;

  const submit = (username: string, password: string) => {
    login(username, password);
  };

  useEffect(() => {
    if (loggedIn) {
      message.success("登录成功");
      if (history.length === 1) {
        history.replace("/profile");
      } else {
        history.goBack();
      }
    }
    // eslint-disable-next-line
  }, [loggedIn]);

  useEffect(() => {
    if (error) {
      message.error("登录失败");
    }
  }, [error]);

  return (
    <div className={styles.root}>
      <Card className={styles.card}>
        <img className={styles.logo} alt="logo" src={logo} />
        <WrappedLoginForm submit={submit} loggingIn={loggingIn} />
      </Card>
    </div>
  );
};

function mapStateToProps(state: IAppState): ILoginPageStateProps {
  return {
    loggedIn: state.auth.loggedIn,
    loggingIn: state.auth.loggingIn,
    error: state.auth.error,
  };
}

const mapDispatchToProps: ILoginPageDispatchProps = {
  login,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LoginPage)
);

interface ILoginFormProps extends FormComponentProps {
  submit: (username: string, password: string) => void;
  loggingIn: boolean;
}

const LoginForm: React.FC<ILoginFormProps> = ({ form, submit, loggingIn }) => {
  const { getFieldDecorator } = form;

  const handleSubmit = () => {
    form.validateFields(async (err, values) => {
      if (!err && values.username && values.password) {
        submit(values.username, values.password);
      }
    });
  };

  return (
    <Form>
      <Form.Item>
        {getFieldDecorator("username", {
          rules: [{ required: true, message: "请输入用户名" }],
        })(
          <Input
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="用户名"
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="on"
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("password", {
          rules: [{ required: true, message: "请输入密码" }],
        })(
          <Input.Password
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
            type="password"
            placeholder="密码"
            autoComplete="on"
          />
        )}
      </Form.Item>
      <Form.Item>
        <Link style={{ float: "left" }} replace to="/register">
          注册
        </Link>
        <Link style={{ float: "right" }} replace to="/reset">
          忘记密码？
        </Link>
        <Button
          style={{ width: "100%" }}
          type="primary"
          htmlType="submit"
          onClick={handleSubmit}
          loading={loggingIn}
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

const WrappedLoginForm = Form.create<ILoginFormProps>()(LoginForm);
