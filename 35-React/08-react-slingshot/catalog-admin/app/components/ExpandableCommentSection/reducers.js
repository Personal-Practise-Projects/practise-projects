import { SET_EDITED_VERSION_ID } from '../../actions/types';

export const EDITED_VERSION_DEFAULT_STATE = {
  currentExpandedVersionId: null,
};

export function expandableCommentSectionReducer(
  state = EDITED_VERSION_DEFAULT_STATE,
  { type, payload },
) {
  switch (type) {
    case SET_EDITED_VERSION_ID:
      return {
        ...state,
        currentExpandedVersionId: payload,
      };

    default:
      return state;
  }
}
