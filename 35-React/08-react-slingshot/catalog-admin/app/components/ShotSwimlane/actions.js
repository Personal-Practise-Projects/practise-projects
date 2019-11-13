import { SWIMLANE_META_INFO } from '../../common/constants';
import AxiosBuilder from '../../common/axiosBuilder';
import { StringHelper } from '../../helpers/utils';
import {
  CLEAR_SWIMLANE_DATA,
  FETCH_SWIMLANE_META_INFO,
  FETCH_SWIMLANE_META_INFO_FAILED,
  ON_COLLABORATOR_SELECT,
  ON_SWIMLANE_SEARCH,
  RESET_SWIMLANE,
  SWIMLANE_MOVE_SHOTS,
} from '../../actions/types';

export const fetchSwimlaneMetaInfo = stage => dispatch => {
  new AxiosBuilder(StringHelper.format(SWIMLANE_META_INFO, stage))
    .withAuth()
    .fetch()
    .then(metaInfoRes => {
      dispatch({
        type: FETCH_SWIMLANE_META_INFO,
        payload: metaInfoRes.data,
      });
    })
    .catch(error => {
      dispatch({
        type: FETCH_SWIMLANE_META_INFO_FAILED,
        payload: error,
      });
    });
};

export const clearSwimLaneData = () => ({
  type: CLEAR_SWIMLANE_DATA,
});

export const resetSwimLaneData = swimlaneType => ({
  type: RESET_SWIMLANE,
  payload: swimlaneType,
});

export const fetchSwimlane = (status, payload) => ({
  type: status,
  payload,
});

export const onSwimlaneSearch = payload => ({
  type: ON_SWIMLANE_SEARCH,
  payload,
});

export const swimlaneCardMoveHandler = (
  shotCard,
  toStatus,
  fromSwimlane,
  toSwimlane,
) => dispatch => {
  const config = {};
  updateShotDetails(shotCard, toSwimlane);
  config.data = JSON.stringify({ shot_info: { status: toSwimlane } });
  new AxiosBuilder(`/shot/${shotCard.id}/`, config).PATCH().then(result => {
    Object.assign(shotCard, result.data);
  });
  dispatch({
    type: SWIMLANE_MOVE_SHOTS,
    payload: {
      fromSwimlane,
      toSwimlane,
      shot: shotCard,
    },
  });
};

function updateShotDetails(shotCard, toSwimlane) {
  shotCard.shot_info.status = toSwimlane;
  shotCard.shot_info.counter_info = null;
}

export const onCollaboratorSelect = shots => ({
  type: ON_COLLABORATOR_SELECT,
  payload: shots,
});
