import { Button, Col, Form, Input, Popover, Progress, Row, Select, message } from 'antd';
import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';
import { StateType } from '@/models/register';
import styles from './style.less';
import { ConnectState } from '@/models/connect';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};
const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
interface UserRegisterProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  register: StateType;
  submitting: boolean;
}
interface UserRegisterState {
  count: number;
  confirmDirty: boolean;
  visible: boolean;
  help: string;
  prefix: string;
}

@connect(({ register, loading }: ConnectState) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
class UserRegister extends Component<UserRegisterProps, UserRegisterState> {
  state: UserRegisterState = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
  };

  interval: number | undefined = undefined;

  componentDidUpdate() {
    const { register, form } = this.props;
    const account = form.getFieldValue('userName');

    if (register.status === 'ok' && account !== '') {
      message.success('注册成功！');
      router.push({
        pathname: '/',
        state: {
          account,
        },
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    let count = 59;
    this.setState({
      count,
    });
    this.interval = window.setInterval(() => {
      count -= 1;
      this.setState({
        count,
      });

      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');

    if (value && value.length > 5) {
      return 'ok';
    }

    if (value && value.length > 3) {
      return 'pass';
    }

    return 'poor';
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields(
      {
        force: true,
      },
      (err, values) => {
        if (!err) {
          dispatch({
            type: 'register/submit',
            payload: { ...values },
          });
        }
      },
    );
  };

  checkConfirm = (rule: any, value: string, callback: (messgae?: string) => void) => {
    const { form } = this.props;

    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkPassword = (rule: any, value: string, callback: (messgae?: string) => void) => {
    const { visible, confirmDirty } = this.state;

    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });

      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }

      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;

        if (value && confirmDirty) {
          form.validateFields(['confirm'], {
            force: true,
          });
        }

        callback();
      }
    }
  };

  changePrefix = (value: string) => {
    this.setState({
      prefix: value,
    });
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix, help, visible } = this.state;
    return (
      <div className={styles.main}>
        {/* <h3>
         <FormattedMessage id="register.register.register" />
        </h3> */}
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ],
            })(<Input size="large" placeholder="用户名" />)}
          </FormItem>
          {/* <FormItem>
           {getFieldDecorator('mail', {
             rules: [
               {
                 required: true,
                 message: formatMessage({ id: 'register.email.required' }),
               },
               {
                 type: 'email',
                 message: formatMessage({ id: 'register.email.wrong-format' }),
               },
             ],
           })(
             <Input
               size="large"
               placeholder={formatMessage({ id: 'register.email.placeholder' })}
             />,
           )}
          </FormItem> */}
          <FormItem help={help}>
            <Popover
              getPopupContainer={node => {
                if (node && node.parentNode) {
                  return node.parentNode as HTMLElement;
                }

                return node;
              }}
              content={
                <div
                  style={{
                    padding: '4px 0',
                  }}
                >
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div
                    style={{
                      marginTop: 10,
                    }}
                  >
                    请至少输入 6 个字符。请不要使用容易被猜到的密码。
                  </div>
                </div>
              }
              overlayStyle={{
                width: 240,
              }}
              placement="right"
              visible={visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(<Input size="large" type="password" placeholder="至少6位密码，区分大小写" />)}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请确认密码！',
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" placeholder="确认密码" />)}
          </FormItem>
          {/* <FormItem>
           <InputGroup compact>
             <Select
               size="large"
               value={prefix}
               onChange={this.changePrefix}
               style={{ width: '20%' }}
             >
               <Option value="86">+86</Option>
               <Option value="87">+87</Option>
             </Select>
             {getFieldDecorator('mobile', {
               rules: [
                 {
                   required: true,
                   message: formatMessage({ id: 'register.phone-number.required' }),
                 },
                 {
                   pattern: /^\d{11}$/,
                   message: formatMessage({ id: 'register.phone-number.wrong-format' }),
                 },
               ],
             })(
               <Input
                 size="large"
                 style={{ width: '80%' }}
                 placeholder={formatMessage({ id: 'register.phone-number.placeholder' })}
               />,
             )}
           </InputGroup>
          </FormItem> */}
          {/* <FormItem>
           <Row gutter={8}>
             <Col span={16}>
               {getFieldDecorator('captcha', {
                 rules: [
                   {
                     required: true,
                     message: formatMessage({ id: 'register.verification-code.required' }),
                   },
                 ],
               })(
                 <Input
                   size="large"
                   placeholder={formatMessage({ id: 'register.verification-code.placeholder' })}
                 />,
               )}
             </Col>
             <Col span={8}>
               <Button
                 size="large"
                 disabled={!!count}
                 className={styles.getCaptcha}
                 onClick={this.onGetCaptcha}
               >
                 {count
                   ? `${count} s`
                   : formatMessage({ id: 'register.register.get-verification-code' })}
               </Button>
             </Col>
           </Row>
          </FormItem> */}
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              注册
            </Button>
            <Link className={styles.login} to="/user/login">
              使用已有账户登录
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create<UserRegisterProps>()(UserRegister);
