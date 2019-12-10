import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { CardListItemDataType } from './data.d';
import { queryCatsList, addCat } from './service';

export interface StateType {
  list: CardListItemDataType[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    fetchAddCat: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'catsList',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const { data } = yield call(queryCatsList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(data) ? data : [],
      });
    },
    *fetchAddCat({ payload }, { call, put }) {
      yield call(addCat, payload);
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    }
  },
};

export default Model;
