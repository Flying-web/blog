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
import RcViewer from '@hanyk/rc-viewer'
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

const catsName = {}

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

  options = {
    filter(image: any) {
      return image.alt === 'showModal' ? true : false
    },
  };

  render() {
    const {
      catsList: { list },
      loading,
    } = this.props;

    list.forEach(i => {
      catsName[i.name] = i.name
    })
    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          有人说猫咪的颜值跟主人有关，瞧这猫咪，颜值跟主人一样高呀
        </p>
        <div className={styles.contentLink}>
          {
            Object.keys(catsName).map((item, index) => (
              <a key={index}>
                <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />
                {item}
              </a>
            ))
          }
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="猫展"
          src="/api/public/upload/avatar/timg.jpg"
        />
      </div>
    );
    const nullData: Partial<CardListItemDataType> = {};
    // const { visible, confirmLoading, ModalText } = this.state;
    return (
      <PageHeaderWrapper content={content} extraContent={extraContent} className={styles.catsStyle}>
        <div className={styles.cardList}>
          <RcViewer options={this.options}>
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
                        cover={
                          <img alt="showModal" data-show={'true'} className={styles.cardCover} src={item.poster} />
                        }
                      // actions={[<a key="option1">操作一</a>, <a key="option2">操作二</a>]}
                      >
                        <Card.Meta
                          avatar={
                            <div className={styles.catItem}>
                              <img alt="" className={styles.cardAvatar} src={item.avatar} />
                              <span className={styles.catName}><span>{item.name}</span><span>{item.type}</span></span>
                            </div>
                          }
                          title={

                            <a>{item.title}</a>
                          }
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
          </RcViewer>
          <CreateForm
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CatsList;
