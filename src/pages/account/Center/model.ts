import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { CurrentUser, ListItemDataType } from './data.d';
import { queryFakeList } from './service';

export interface ModalState {
  currentUser: Partial<CurrentUser>;
  list: ListItemDataType[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ModalState) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    fetch: Effect;
  };
  reducers: {
    queryList: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'accountAndCenter',

  state: {
    currentUser: {},
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...(state as ModalState),
        list: action.payload,
      };
    },
  },
};

export default Model;
