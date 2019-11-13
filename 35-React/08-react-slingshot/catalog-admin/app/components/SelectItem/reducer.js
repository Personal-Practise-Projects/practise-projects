import {
  SELECT_ALL,
  SELECT_ROW,
  UN_SELECT_ALL,
  UN_SELECT_ALL_EVENT,
  UN_SELECT_ROW,
} from '../../actions/types';
import { GLOBAL_EVENT_TYPE } from '../../common/constants';
import { ArrayUtils } from '../../helpers/utils';

export const SELECT_DEFAULT_STATE = {
  [GLOBAL_EVENT_TYPE.SHOT]: {
    count: 0,
    data: [],
    dataDict: {},
  },
};

export function selectedItemsReducer(
  state = SELECT_DEFAULT_STATE,
  { type, payload },
) {
  switch (type) {
    case SELECT_ROW: {
      state[payload.type].data.push(payload.data.selectableData);
      if (state[payload.type].dataDict[payload.parent]) {
        state[payload.type].dataDict[payload.parent] = {
          ...state[payload.type].dataDict[payload.parent],
        };
      } else {
        state[payload.type].dataDict[payload.parent] = {};
      }
      state[payload.type].dataDict[payload.parent][
        payload.data.selectableData.id
      ] = payload.data.selectableData;
      state[payload.type].count = state[payload.type].data.length;
      return {
        ...state,
      };
    }
    case SELECT_ALL: {
      state[payload.type].dataDict[payload.parent] = {};
      payload.data.forEach(item => {
        state[payload.type].dataDict[payload.parent][item.selectableData.id] =
          item.selectableData;
      });
      state[payload.type].data = [];
      ArrayUtils.keys(state[payload.type].dataDict).forEach(key =>
        state[payload.type].data.push(
          ...ArrayUtils.values(state[payload.type].dataDict[key]),
        ),
      );
      state[payload.type].count = state[payload.type].data.length;
      return {
        ...state,
      };
    }
    case UN_SELECT_ROW: {
      state[payload.type].data = state[payload.type].data.filter(
        obj => obj.id !== payload.data.selectableData.id,
      );
      if (state[payload.type].dataDict[payload.parent]) {
        state[payload.type].dataDict[payload.parent] = {
          ...state[payload.type].dataDict[payload.parent],
        };
      } else {
        state[payload.type].dataDict[payload.parent] = {};
      }
      delete state[payload.type].dataDict[payload.parent][
        payload.data.selectableData.id
      ];
      state[payload.type].count = state[payload.type].data.length;
      return {
        ...state,
      };
    }
    case UN_SELECT_ALL: {
      delete state[payload.type].dataDict[payload.parent];
      // Evaluate selected data based on data the objects in dict
      state[payload.type].data = [];
      ArrayUtils.keys(state[payload.type].dataDict).forEach(key =>
        state[payload.type].data.push(
          ...ArrayUtils.values(state[payload.type].dataDict[key]),
        ),
      );
      state[payload.type].count = state[payload.type].data.length;
      return {
        ...state,
      };
    }
    case UN_SELECT_ALL_EVENT: {
      state[payload.type].count = 0;
      state[payload.type].data = [];
      state[payload.type].dataDict = {};
      return {
        ...state,
      };
    }
    default:
      return state;
  }
}
