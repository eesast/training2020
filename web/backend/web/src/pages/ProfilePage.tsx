import React, { useState } from "react";
import { AutoComplete, Button, Card, Form, Input, message } from "antd";
import { FormComponentProps, ValidationRule, FormProps } from "antd/lib/form";
import { InputProps } from "antd/lib/input";
import { isNumeric } from "../helpers";
import { AutoCompleteProps } from "antd/lib/auto-complete";
import { IUser, IAppState } from "../redux/types/state";
import { WithRouterComponent } from "../types/WithRouterComponent";
import api from "../api";
import styles from "./ProfilePage.module.css";
import { updateUserAction } from "../redux/actions/auth";
import { connect } from "react-redux";

export interface IProfilePageStateProps {
  user: IUser;
}

export interface IProfilePageDispatchProps {
  updateUserAction: typeof updateUserAction;
}

type IProfilePageProps = IProfilePageStateProps & IProfilePageDispatchProps;

const ProfilePage: React.FC<IProfilePageProps> = ({
  user,
  updateUserAction,
}) => {
  return (
    <div className={styles.root}>
      <Card className={styles.card}>
        <h1>个人信息</h1>
        <WrappedProfileForm user={user} update={updateUserAction} />
      </Card>
    </div>
  );
};

function mapStateToProps(state: IAppState): IProfilePageStateProps {
  return {
    user: state.auth.user!,
  };
}

const mapDispatchToProps: IProfilePageDispatchProps = {
  updateUserAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);

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

interface IProfileFormProps extends FormComponentProps {
  user: IUser;
  update: typeof updateUserAction;
}

const ProfileForm: React.FC<WithRouterComponent<{}, IProfileFormProps>> = (
  props
) => {
  const { getFieldDecorator } = props.form;
  const { user, update } = props;

  const [confirmDirty, setConfirmDirty] = useState(false);
  const [autoCompleteResult, setAutoCompleteResult] = useState<string[]>([]);

  const handleConfirmBlur: InputProps["onBlur"] = (e) => {
    const value = e.target.value;
    setConfirmDirty(confirmDirty || !!value);
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
          if (!values.password) {
            values.password = undefined;
          }

          await api.updateUser(user.id, {
            password: values.password,
            email: values.email,
            phone: parseFloat(values.phone),
            department: values.department,
            class: values.class,
          });

          update(user.id, {
            password: values.password,
            email: values.email,
            phone: parseFloat(values.phone),
            department: values.department,
            class: values.class,
          } as IUser);

          message.success("更新成功");
        } catch {
          message.error("更新失败");
        }
      } else {
        message.error("请完整填写所有信息");
      }
    });
  };

  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <FormItem label="学号">
        <Input readOnly defaultValue={user.id.toString()} />
      </FormItem>
      <FormItem label="用户名">
        <Input readOnly defaultValue={user.username} />
      </FormItem>
      <FormItem label="Email">
        {getFieldDecorator("email", {
          initialValue: user.email,
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
          initialValue: user.phone ? user.phone.toString() : undefined,
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
              message: "请再次输入密码",
            },
            {
              validator: compareToFirstPassword,
            },
          ],
        })(<Input type="password" onBlur={handleConfirmBlur} />)}
      </FormItem>
      <FormItem label="姓名">
        <Input readOnly defaultValue={user.name} />
      </FormItem>
      <FormItem label="院系">
        {getFieldDecorator("department", {
          initialValue: user.department,
          rules: [{ required: true, message: "请输入院系" }],
        })(<Input placeholder="简写，如：电子系" />)}
      </FormItem>
      <FormItem label="班级">
        {getFieldDecorator("class", {
          initialValue: user.class,
          rules: [{ required: true, message: "请输入班级" }],
        })(<Input placeholder="如：无61" />)}
      </FormItem>
      <FormItem {...tailFormItemLayout} style={{ textAlign: "center" }}>
        <Button type="primary" htmlType="submit">
          更新
        </Button>
      </FormItem>
    </Form>
  );
};

const WrappedProfileForm = Form.create<IProfileFormProps>()(ProfileForm);
