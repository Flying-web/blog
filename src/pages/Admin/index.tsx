import React, { Component } from 'react';
import { Card, Table, Divider, Tag } from 'antd';
import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import styles from './style.less'
interface AdminProps {
  dispatch?: Dispatch<any>;
  listloading?: boolean;
  usersList: any
}

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    render: (text: any, row: any) => (
      <div>
        <img className={styles.avatar} src={row.avatar} alt="avatar" />
        <a>{text}</a>
      </div>
    ),
  },
  {
    title: '角色',
    dataIndex: 'authority',
    key: 'authority',
    render: (text: string) => {
      if (text === 'admin') {
        return (
          <Tag color="#f50">{text}</Tag>
        )
      } else if (text === 'user') {
        return (
          <Tag color="#2db7f5">{text}</Tag>
        )
      } else {
        return (
          <Tag color="#108ee9">{text}</Tag>
        )
      }
    },
  },
  {
    title: '简介',
    dataIndex: 'usergroup',
    key: 'usergroup',
  },
  {
    title: '地址',
    key: 'address',
    dataIndex: 'address',
  },
  {
    title: '邮箱',
    key: 'email',
    dataIndex: 'email',
  },
  {
    title: '电话',
    key: 'phone',
    dataIndex: 'phone',
  },
  {
    title: '创建时间',
    key: 'creatTime',
    dataIndex: 'creatTime',
  },
];
@connect(({ user, loading }: ConnectState) => ({
  usersList: user.allUsers,
  listloading: loading.models.user
}))
class Admin extends Component<AdminProps> {
  componentDidMount() {
    const { dispatch } = this.props
    if (dispatch) {
      dispatch({
        type: 'user/fetchgetAllUsers'
      })
    }
  }

  render() {
    const { usersList, listloading } = this.props
    return (
      <PageHeaderWrapper>
        <Card>
          <Table rowKey={'userid'} loading={listloading} columns={columns} dataSource={usersList} />
        </Card>
      </PageHeaderWrapper>
    )
  }

}

export default Admin
