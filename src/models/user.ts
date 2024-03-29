import { Effect } from 'dva';
import { Reducer } from 'redux';
import { message } from 'antd';
import {
  queryCurrent,
  query as queryUsers,
  changeUserInfo,
  getAllUsers,
  changeUserAvatar,
  updateTags,
} from '@/services/user';

export interface CurrentUser {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
}
export interface UserModelState {
  currentUser?: CurrentUser;
  allUsers?: any[];
}
export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
    fetchChangeCurrent: Effect;
    fetchChangeCurrentAvatar: Effect;
    fetchgetAllUsers: Effect;
    fetchUpdateCurrentTags: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    getAllUsers: Reducer<UserModelState>;
    changeCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}
const UserModel: UserModelType = {
  namespace: 'user',
  state: {
    currentUser: {},
    allUsers: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const { data } = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: data,
      });
    },

    *fetchChangeCurrent({ payload }, { call, put }) {
      const response = yield call(changeUserInfo, payload);
      yield put({
        type: 'changeCurrentUser',
        payload: response.data,
      });

      if (response.status === 'ok') {
        message.success('更新基本信息成功');
      }
    },

    *fetchChangeCurrentAvatar({ payload }, { call, put }) {
      const response = yield call(changeUserAvatar, payload);
      yield put({
        type: 'changeCurrentUser',
        payload: response.data,
      });
      message.success('更新基本信息成功');
    },

    *fetchUpdateCurrentTags({ payload }, { call, put }) {
      const { data } = yield call(updateTags, JSON.stringify(payload));
      yield put({
        type: 'changeCurrentUser',
        payload: data,
      });
    },

    *fetchgetAllUsers({ payload }, { call, put }) {
      const response = yield call(getAllUsers, payload);
      yield put({
        type: 'getAllUsers',
        payload: response.data,
      });
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    getAllUsers(state, action) {
      return { ...state, allUsers: action.payload || [] };
    },

    changeCurrentUser(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return { ...state, currentUser: { ...state.currentUser, ...action.payload } };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
