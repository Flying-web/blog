import { Avatar, Card, Col, Divider, Icon, Input, Row, Tag } from 'antd';
import React, { PureComponent } from 'react';

import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import Link from 'umi/link';
import { RouteChildrenProps } from 'react-router';
import { connect } from 'dva';
// import { ModalState } from './model';
import { ConnectState, ConnectProps } from '@/models/connect';
import Projects from './components/Projects';
import Articles from './components/Articles';
import Applications from './components/Applications';
import { CurrentUser, TagType } from './data.d';
import styles from './center.less';

const operationTabList = [
  {
    key: 'articles',
    tab: (
      <span>
        文章 <span style={{ fontSize: 14 }}>(8)</span>
      </span>
    ),
  },
  {
    key: 'applications',
    tab: (
      <span>
        应用 <span style={{ fontSize: 14 }}>(8)</span>
      </span>
    ),
  },
  {
    key: 'projects',
    tab: (
      <span>
        项目 <span style={{ fontSize: 14 }}>(8)</span>
      </span>
    ),
  },
];

interface CenterProps extends RouteChildrenProps {
  dispatch: Dispatch<any>;
  currentUser: CurrentUser;
  currentUserLoading: boolean;
}
interface CenterState {
  newTags: TagType[];
  tabKey: 'articles' | 'applications' | 'projects';
  inputVisible: boolean;
  inputValue: string;
}
// console.log(ConnectState)
@connect(
  ({
    loading,
    user,
  }: ConnectState) => ({
    currentUser: user.currentUser,
    currentUserLoading: loading.models.user,
  }),
)
class Center extends PureComponent<
CenterProps,
CenterState
> {
  // static getDerivedStateFromProps(
  //   props: accountAndCenterProps,
  //   state: accountAndCenterState,
  // ) {
  //   const { match, location } = props;
  //   const { tabKey } = state;
  //   const path = match && match.path;

  //   const urlTabKey = location.pathname.replace(`${path}/`, '');
  //   if (urlTabKey && urlTabKey !== '/' && tabKey !== urlTabKey) {
  //     return {
  //       tabKey: urlTabKey,
  //     };
  //   }

  //   return null;
  // }

  state: CenterState = {
    newTags: [],
    inputVisible: false,
    inputValue: '',
    tabKey: 'articles',
  };

  public input: Input | null | undefined = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'accountAndCenter/fetchCurrent',
    // });
    dispatch({
      type: 'accountAndCenter/fetch',
    });
  }

  onTabChange = (key: string) => {
    // If you need to sync state to url
    // const { match } = this.props;
    // router.push(`${match.url}/${key}`);
    this.setState({
      tabKey: key as CenterState['tabKey'],
    });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input && this.input.focus());
  };

  saveInputRef = (input: Input | null) => {
    this.input = input;
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let newTags:any = [];
    const { dispatch, currentUser } = this.props;
    const currentUserTags = Array.isArray(currentUser.tags) ? currentUser.tags : []
    const startcount = currentUserTags.length
    if (inputValue && currentUserTags.filter(tag => tag.label === inputValue).length === 0) {
      newTags = [...newTags, { key: `new-${startcount + newTags.length}`, label: inputValue }];
    }
    this.setState({
      inputVisible: false,
      inputValue: '',
    });
    if (dispatch) {
      dispatch({
        type: 'user/fetchUpdateCurrentTags',
        payload: currentUserTags.concat(newTags)
      });
    }
  };

  renderChildrenByTabKey = (tabKey: CenterState['tabKey']) => {
    if (tabKey === 'projects') {
      return <Projects />;
    }
    if (tabKey === 'applications') {
      return <Applications />;
    }
    if (tabKey === 'articles') {
      return <Articles />;
    }
    return null;
  };

  render() {
    const { newTags, inputVisible, inputValue, tabKey } = this.state;
    const { currentUser, currentUserLoading } = this.props;
    const dataLoading = !(currentUser && Object.keys(currentUser).length);
    const currentUserTags = Array.isArray(currentUser.tags) ? currentUser.tags : []
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={dataLoading}>
              {!dataLoading && (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={currentUser.avatar} />
                    <div className={styles.name}>{currentUser.name}</div>
                    <div>{currentUser.signature}</div>
                  </div>
                  <div className={styles.detail}>
                    {/* <p>
                      <i className={styles.title} />
                      {'currentUser.title'}
                    </p> */}
                    {currentUser.group && (
                      <p>
                        <i className={styles.group} />
                        {currentUser.group}
                      </p>
                    )}
                    {currentUser.geographic && (
                       <p>
                       <i className={styles.address} />
                       {currentUser.geographic.province.label}
                       {currentUser.geographic.city.label}
                     </p>
                    )}
                  </div>
                  <Divider dashed />
                  <div className={styles.tags}>
                    <div className={styles.tagsTitle}>标签</div>
                    {currentUserTags.map(item => (
                      <Tag key={item.key}>{item.label}</Tag>
                    ))}
                    {inputVisible && (
                      <Input
                        ref={ref => this.saveInputRef(ref)}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                      />
                    )}
                    {!inputVisible && (
                      <Tag
                        onClick={this.showInput}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                      >
                        <Icon type="plus" />
                      </Tag>
                    )}
                  </div>
                  <Divider style={{ marginTop: 16 }} dashed />
                  {/* <div className={styles.team}>
                    <div className={styles.teamTitle}>团队</div>
                    <Row gutter={36}>
                      {currentUser.notice &&
                        currentUser.notice.map(item => (
                          <Col key={item.id} lg={24} xl={12}>
                            <Link to={item.href}>
                              <Avatar size="small" src={item.logo} />
                              {item.member}
                            </Link>
                          </Col>
                        ))}
                    </Row>
                  </div> */}
                </div>
              )}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={tabKey}
              onTabChange={this.onTabChange}
            >
              {this.renderChildrenByTabKey(tabKey)}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Center;
