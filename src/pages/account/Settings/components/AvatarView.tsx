import { Button, Upload, message, Icon } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React, { Component, Fragment } from 'react';
import styles from './BaseView.less';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';


function getBase64(img: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
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

interface avatarViewProps extends ConnectProps {
    avatar: string;
    onChange: any;
    loading: Boolean;
}
interface avatarViewStates {
    imageUrl: string;
    loading: Boolean;
}
@connect(({ user, loading }: ConnectState) => ({
    currentUser: user.currentUser,
    loading: loading.models.user,
}))
class AvatarView extends Component<avatarViewProps, avatarViewStates> {
    state: avatarViewStates = {
        imageUrl: "",
        loading: false
    }
    handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            // getBase64(info.file.originFileObj, (imageUrl: any) =>
            //    {
            //     this.setState({
            //         imageUrl,
            //         loading: false,
            //     })
            //     const avatar = info.file.response.data.avatar.path
            //    }
            // );
            const imageUrl = info.file.response.data.path

            const { dispatch } = this.props
            if (dispatch) {
                dispatch({
                    type: 'user/fetchChangeCurrentAvatar',
                    payload: {
                        avatar: imageUrl
                    }
                }).then(() => {
                    this.setState({
                        imageUrl: imageUrl,
                        loading: false,
                    })
                })
            }

        }
    };

    render() {
        const { avatar, loading } = this.props
        return (
            <Fragment>
                <div className={styles.avatar_title}>
                    <FormattedMessage id="userandsettings.basic.avatar" defaultMessage="Avatar" />
                </div>
                <div className={styles.avatar}>
                    {loading && <Icon className={styles.avatarLoading} type="loading" />}
                    <img src={avatar} alt="avatar" />
                </div>
                <Upload
                    name="file"
                    showUploadList={false}
                    // 是否每次更改图片都要上传到后台
                    action="/api/upload"
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}>
                    <div className={styles.button_view}>
                        <Button icon="upload">
                            <FormattedMessage id="userandsettings.basic.change-avatar" defaultMessage="Change avatar" />
                        </Button>
                    </div>
                </Upload>
            </Fragment>
        )
    }

}

export default AvatarView