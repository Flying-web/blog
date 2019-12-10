import { Button, Card, Icon, List, Typography, Modal, Input, message } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { StateType } from './model';
import { CardListItemDataType } from './data.d';
import styles from './style.less';
import jingang from '@/assets/jingang.jpg'
import { spawn } from 'child_process';
import CreateForm from './createForm'
import { catStates } from './service'
const { Paragraph } = Typography;

interface catsListProps {
  catsList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}
interface catsListState {
  visible: boolean;
  done?: boolean;
  current?: Partial<CardListItemDataType>;
}

@connect(
  ({
    catsList,
    loading,
  }: {
    catsList: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    catsList,
    loading: loading.models.catsList,
  }),
)
class CatsList extends Component<
catsListProps,
catsListState
> {
  formRef: any = {}
  state: catsListState = {
    visible: false,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'catsList/fetch',
      payload: {
        count: 8,
      },
    });
  }
  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = async (values: any, rest: () => {}) => {
    console.log('Received values of form: ', values);
    const catItem: catStates = { ...values, poster: values.poster[0].response.data.path }
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'catsList/fetchAddCat',
      payload: catItem,
    });
    console.log(res)
    message.success('提交成功');
    rest()
    this.setState({ visible: false });
    
    dispatch({
      type: 'catsList/fetch',
      payload: {
        count: 8,
      },
    });

  };

  saveFormRef = (formRef: any) => {
    this.formRef = formRef;
  };

  render() {
    const {
      catsList: { list },
      loading,
    } = this.props;
    console.log(list)

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          闲暇之际，看看猫主子，虽然丑但是有肉
        </p>
        <div className={styles.contentLink}>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
            金刚
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" />{' '}
            骨折猫
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" />{' '}
            蓝胖子
          </a>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );
    const nullData: Partial<CardListItemDataType> = {};
    // const { visible, confirmLoading, ModalText } = this.state;
    return (
      <PageHeaderWrapper content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List<Partial<CardListItemDataType>>
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 4, md: 3, sm: 2, xs: 1 }}
            dataSource={[nullData, ...list]}
            renderItem={item => {
              if (item && item.id) {
                return (
                  <List.Item key={item.id}>
                    <Card
                      hoverable
                      className={styles.card}
                      cover={<img alt="example" className={styles.cardCover} src={item.poster} />}
                    // actions={[<a key="option1">操作一</a>, <a key="option2">操作二</a>]}
                    >
                      <Card.Meta
                        avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                        title={<a>{item.title}</a>}
                        description={
                          <Paragraph className={styles.item} ellipsis={{ rows: 1 }}>
                            {item.content}
                          </Paragraph>
                        }
                      />
                    </Card>
                  </List.Item>
                );
              }
              return (
                <List.Item key={'addcat'}>
                  <Button type="dashed" className={styles.newButton} onClick={this.showModal}>
                    <Icon type="plus" /> 新增图片
                  </Button>
                </List.Item>
              );
            }}
          />
          <CreateForm
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CatsList;
