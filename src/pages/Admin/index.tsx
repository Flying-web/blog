import React, { Component } from 'react';
import { Card, Table, Divider, Tag } from 'antd';
import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
interface AdminProps {
  dispatch?: Dispatch<any>;
  listloading?: boolean;
  usersList: any
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: any) => <a>{text}</a>,
  },
  {
    title: '角色',
    dataIndex: 'authority',
    key: 'authority',
  },
  {
    title: '创建时间',
    dataIndex: 'creatTime',
    key: 'creatTime',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: '国家',
    key: 'country',
    dataIndex: 'country',
  },
];
@connect(({user, loading}: ConnectState) => ({
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
          <Table loading={listloading} columns={columns} dataSource={usersList} />
        </Card>
      </PageHeaderWrapper>
    )
  }

}

export default Admin
