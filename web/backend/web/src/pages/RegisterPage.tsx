import React, { useState } from "react";
import {
  AutoComplete,
  Button,
  Card,
  Form,
  Icon,
  Input,
  message,
  Tooltip,
} from "antd";
import { withRouter } from "react-router-dom";
import { FormComponentProps, ValidationRule, FormProps } from "antd/lib/form";
import { InputProps } from "antd/lib/input";
import { isNumeric } from "../helpers";
import { AutoCompleteProps } from "antd/lib/auto-complete";
import { IUser } from "../redux/types/state";
import { WithRouterComponent } from "../types/WithRouterComponent";
import api from "../api";
import styles from "./RegisterPage.module.css";

const RegisterPage: React.FC = () => {
  return (
    <div className={styles.root}>
      <Card className={styles.card}>
        <h1>注册</h1>
        <WrappedRegisterForm />
      </Card>
    </div>
  );
};

export default RegisterPage;

const FormItem = Form.Item;
const AutoCompleteOption = AutoComplete.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

interface IRegisterFormProps extends FormComponentProps {
  submit: (username: string, password: string) => void;
}

const RegisterForm: React.FC<WithRouterComponent<{}, IRegisterFormProps>> = (
  props
) => {
  const { getFieldDecorator } = props.form;

  const [confirmDirty, setConfirmDirty] = useState(false);
  const [autoCompleteResult, setAutoCompleteResult] = useState<string[]>([]);

  const handleConfirmBlur: InputProps["onBlur"] = (e) => {
    const value = e.target.value;
    setConfirmDirty(confirmDirty || !!value);
  };

  const validateId: ValidationRule["validator"] = (
    rule,
    value: any,
    callback: any
  ) => {
    if (value && (!isNumeric(value) || value.length !== 10)) {
      callback("请输入正确的学号");
    } else {
      callback();
    }
  };

  const validatePhone: ValidationRule["validator"] = (
    rule,
    value: any,
    callback: any
  ) => {
    if (value && (!isNumeric(value) || value.length !== 11)) {
      callback("请输入正确的手机号");
    } else {
      callback();
    }
  };

  const compareToFirstPassword: ValidationRule["validator"] = (
    rule,
    value,
    callback: any
  ) => {
    const form = props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("两次输入的密码不一致");
    } else {
      callback();
    }
  };

  const validateToNextPassword: ValidationRule["validator"] = (
    rule,
    value,
    callback: any
  ) => {
    const form = props.form;
    if (value && confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  const handleEmailChange: AutoCompleteProps["onChange"] = (value) => {
    let result: string[];
    if (!value) {
      result = [];
    } else {
      result = [
        "@mails.tsinghua.edu.cn",
        "@qq.com",
        "@gmail.com",
        "@163.com",
        "@126.com",
        "@outlook.com",
        "@hotmail.com",
        "@sina.com",
      ].map((domain) => `${value}${domain}`);
    }
    setAutoCompleteResult(result);
  };

  const handleSubmit: FormProps["onSubmit"] = (e) => {
    e.preventDefault();
    props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        try {
          await api.register({
            id: parseFloat(values.id),
            username: values.username,
            password: values.password,
            email: values.email,
            name: values.name,
            phone: parseFloat(values.phone),
            department: values.department,
            class: values.class,
          } as IUser);
          message.success("注册成功");
          props.history.replace("/login");
        } catch {
          message.error("用户已存在");
        }
      } else {
        message.error("请完整填写所有信息");
      }
    });
  };

  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <FormItem label="学号">
        {getFieldDecorator("id", {
          rules: [
            {
              required: true,
              message: "请输入学号",
            },
            {
              validator: validateId,
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem
        label={
          <span>
            用户名&nbsp;
            <Tooltip title="可以与学号不同">
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>
        }
      >
        {getFieldDecorator("username", {
          rules: [
            {
              required: true,
              message: "请输入用户名",
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem label="Email">
        {getFieldDecorator("email", {
          rules: [
            {
              type: "email",
              message: "请输入有效的清华电子邮箱",
            },
            {
              required: true,
              message: "请输入电子邮箱",
            },
          ],
        })(
          <AutoComplete
            dataSource={autoCompleteResult.map((email) => (
              <AutoCompleteOption key={email}>{email}</AutoCompleteOption>
            ))}
            onChange={handleEmailChange}
          >
            <Input />
          </AutoComplete>
        )}
      </FormItem>
      <FormItem label="手机号码">
        {getFieldDecorator("phone", {
          rules: [
            { required: true, message: "请输入手机号码" },
            {
              validator: validatePhone,
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem label="密码" hasFeedback>
        {getFieldDecorator("password", {
          rules: [
            {
              required: true,
              message: "请输入密码",
            },
            {
              validator: validateToNextPassword,
            },
          ],
        })(<Input type="password" />)}
      </FormItem>
      <FormItem label="确认密码" hasFeedback>
        {getFieldDecorator("confirm", {
          rules: [
            {
              required: true,
              message: "请再次输入密码",
            },
            {
              validator: compareToFirstPassword,
            },
          ],
        })(<Input type="password" onBlur={handleConfirmBlur} />)}
      </FormItem>
      <FormItem label="姓名">
        {getFieldDecorator("name", {
          rules: [{ required: true, message: "请输入姓名" }],
        })(<Input />)}
      </FormItem>
      <FormItem label="院系">
        {getFieldDecorator("department", {
          rules: [{ required: true, message: "请输入院系" }],
        })(<Input placeholder="简写，如：电子系" />)}
      </FormItem>
      <FormItem label="班级">
        {getFieldDecorator("class", {
          rules: [{ required: true, message: "请输入班级" }],
        })(<Input placeholder="如：无61" />)}
      </FormItem>
      <FormItem {...tailFormItemLayout} style={{ textAlign: "center" }}>
        <Button type="primary" htmlType="submit">
          注册
        </Button>
      </FormItem>
    </Form>
  );
};

const WrappedRegisterForm = withRouter(
  Form.create<IRegisterFormProps>()(RegisterForm) as any
);
