import { ALL_SELECT_TYPE } from '../CheckBoxView/constants';

export function getAllSelectState(selectCount, totalCount) {
  switch (selectCount) {
    case 0:
      return ALL_SELECT_TYPE.NONE;
    case totalCount:
      return ALL_SELECT_TYPE.ALL;
    default:
      return ALL_SELECT_TYPE.PARTIAL;
  }
}


export function getAllSelectTitle(selectCount) {
  switch (selectCount) {
    case 0:
      return 'Select all';
    default:
      return 'Unselect all';
  }
}
