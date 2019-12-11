import { Button, Form, Input, Select, Upload, message } from 'antd';
import React, { Component, Fragment } from 'react';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { string } from 'prop-types';
import { CurrentUser } from '../data.d';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
import AvatarView from './AvatarView';
import styles from './BaseView.less';
import { ConnectState, ConnectProps } from '@/models/connect';

const FormItem = Form.Item;
const { Option } = Select;
interface SelectItem {
  label: string;
  key: string;
}

const validatorGeographic = (
  _: any,
  value: {
    province: SelectItem;
    city: SelectItem;
  },
  callback: (message?: string) => void,
) => {
  const { province, city } = value;

  if (!province.key) {
    callback('所在省市');
  }

  if (!city.key) {
    callback('请输入您的所在省市!');
  }

  callback();
};

const validatorPhone = (rule: any, value: string, callback: (message?: string) => void) => {
  const values = value.split('-');

  if (!values[0]) {
    callback('Please input your area code!');
  }

  if (!values[1]) {
    callback('Please input your phone number!');
  }

  callback();
};

interface BaseViewProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  currentUser?: CurrentUser;
}

@connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))
class BaseView extends Component<BaseViewProps> {
  view: HTMLDivElement | undefined = undefined;

  avatar: string = '';

  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;

    if (currentUser) {
      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = currentUser[key] || null;
        form.setFieldsValue(obj);
      });
    }
  };

  onChangeAvatar = (files: any) => {
    const { form } = this.props;
    const avatar = files.response.data.avatar.path;

    if (avatar) {
      this.avatar = avatar;
    }
  };

  getAvatarURL() {
    const { currentUser } = this.props;

    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }

      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }

    return '';
  }

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  };

  handlerSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;

        if (dispatch) {
          dispatch({
            type: 'user/fetchChangeCurrent',
            payload: { ...values },
          });
        }
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label="邮箱">
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的邮箱!',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="昵称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的昵称!',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="个人简介">
              {getFieldDecorator('group', {
                rules: [
                  {
                    required: true,
                    message: '请输入个人简介!',
                  },
                ],
              })(<Input.TextArea placeholder="个人简介" rows={4} />)}
            </FormItem>
            <FormItem label="国家/地区">
              {getFieldDecorator('country', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的国家或地区!',
                  },
                ],
              })(
                <Select
                  style={{
                    maxWidth: 220,
                  }}
                >
                  <Option value="China">中国</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="所在省市">
              {getFieldDecorator('geographic', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的所在省市!',
                  },
                  {
                    validator: validatorGeographic,
                  },
                ],
              })(<GeographicView />)}
            </FormItem>
            <FormItem label="街道地址">
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的街道地址!',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="联系电话">
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的联系电话!',
                  },
                  {
                    validator: validatorPhone,
                  },
                ],
              })(<PhoneView />)}
            </FormItem>
            <Button type="primary" onClick={this.handlerSubmit}>
              更新基本信息
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} onChange={this.onChangeAvatar} />
        </div>
      </div>
    );
  }
}

export default Form.create<BaseViewProps>()(BaseView);
