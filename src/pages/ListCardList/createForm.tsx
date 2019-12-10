import React, { Component } from 'react';
import { Modal, Form, Input, Radio, Card, Upload, Button, message, Icon, Row, Col, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { CurrentUser } from '@/models/user';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import { FormattedMessage } from 'umi-plugin-react/locale';
import styles from './style.less';
const { TextArea } = Input;
const { Option } = Select;

interface BaseViewProps extends FormComponentProps {
  currentUser?: CurrentUser;
  loading?: Boolean;
  visible: boolean;
  onCancel: any;
  onCreate: any;
}

function beforeUpload(file: File) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传图片文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小要小于 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const catsOption = [
  '英短蓝猫',
  '英短蓝白',
  '美短',
  '折耳猫',
  '布偶猫',
  '暹罗猫',
  '波斯猫',
  '狸花猫',
  '橘猫',
]

@connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser
}))
class CreateForm extends Component<BaseViewProps> {
  state = {
    loading: false,
    imageUrl: ''
  };

  onCreate = () =>{
    const { form, onCreate } = this.props;
    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }
      // this.setState({ visible: false });
      onCreate(values, ()=>{
        this.setState({ imageUrl: '' });
        form.resetFields();
      })
    });
  
  }

  handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      const imageUrl = info.file.response.data.path
      console.log(imageUrl)
      this.setState({
        imageUrl,
        loading: false,
      })


    }
  };
  normFile = (e: any) => {
    if (e.file.status === 'uploading') {
      this.setState({ loading: true });
    }
    if (e.file.status === 'done') {
      const imageUrl = e.file.response.data.path
      console.log(imageUrl)
      this.setState({
        imageUrl,
        loading: false,
      })
    }
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const { visible, onCancel, onCreate, form, currentUser } = this.props;
    const avatar = currentUser ? currentUser.avatar : '';
    const { getFieldDecorator } = form;
    const { imageUrl } = this.state;
    const uploadButton = (
      <div className={styles.catsUploadBtn}>
        <Icon style={{ fontSize: '30px', color: '#1890ff' }} type={this.state.loading ? 'loading' : 'plus'} />
        {/* <div className="ant-upload-text">Upload</div> */}
      </div>
    );

    const catsOptions = catsOption.map(item => (<Option key={item} value={item}>{item}</Option>))
    return (
      <Modal
        visible={visible}
        title="Create a new collection"
        okText="Create"
        onCancel={onCancel}
        onOk={this.onCreate}
      >
        <Form className={styles.catsForm} layout={'vertical'}>
          <Card
            hoverable
            className={styles.card}
            cover={
              <Form.Item style={{ padding: '24px 24px 0' }} >
                {getFieldDecorator('poster', {
                  rules: [{ required: true, message: '请上传封面!' }],
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                })(
                  <Upload
                    className={styles.catsUpload}
                    name="file"
                    listType={'picture'}
                    showUploadList={false}
                    // 是否每次更改图片都要上传到后台
                    action="/api/upload"
                    beforeUpload={beforeUpload}>
                    <div className={styles.uploadButton}>
                      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </div>
                  </Upload>
                )}
              </Form.Item>
            }
          // actions={[<a key="option1">操作一</a>, <a key="option2">操作二</a>]}
          >
            <Card.Meta
              avatar={<img alt="" className={styles.cardAvatar} src={avatar} />}
              title={
                <div>
                  <Row gutter={16}>
                    <Col sm={12} xs={24} style={{ textAlign: 'left' }}>
                      <Form.Item>
                        {getFieldDecorator('name', {
                          rules: [{ required: true, message: '请填写标题!' }],
                        })(<Input placeholder='名字: 例 - 我叫金刚' />)
                        } </Form.Item>
                    </Col>
                    <Col sm={12} xs={24} style={{ textAlign: 'left' }}>
                      <Form.Item>
                        {getFieldDecorator('type', {
                          rules: [{ required: true, message: '请填写标题!' }],
                        })(<Select
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="选择品种"
                          optionFilterProp="children"
                          filterOption={(input, option: any) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {catsOptions}
                        </Select>)
                        } </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item>
                    {getFieldDecorator('title', {
                      rules: [{ required: true, message: '请填写标题!' }],
                    })(<Input placeholder='标题: 例 - 我是一只猫' />)
                    } </Form.Item>
                </div>
              }
              description={
                <Form.Item>
                  {getFieldDecorator('content', {
                    rules: [{ required: true, message: '请填写描述信息!' }],
                  })(<TextArea rows={2} placeholder='描述: 例 - 爱吃爱睡' />)}
                </Form.Item>
              }
            />
          </Card>
        </Form>
      </Modal>
    );
  }
}
export default Form.create<BaseViewProps>({ name: 'create_cats' })(CreateForm)
