import { shotCollaboratorParser } from '../../common/shot/helpers';
import {
  AVATAR_STAGE,
  PRODUCTION_COLLABORATOR_END_POINT,
} from '../../common/constants';
import AxiosBuilder from '../../common/axiosBuilder';
import { updateAvatarList } from '../../actions/avatarWrapperActions';
import { queryParamsFromDict } from '../../helpers/common';

export const fetchProductionBoardCollaborator = stage => dispatch => {
  const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const queryParams = queryParamsFromDict({
    for_timezone: currentTimezone,
  });
  const url = `${PRODUCTION_COLLABORATOR_END_POINT}${stage}/?${queryParams}`;
  new AxiosBuilder(url)
    .withAuth()
    .fetch()
    .then(response => {
      dispatch(
        updateAvatarList({
          type: AVATAR_STAGE[stage],
          data: shotCollaboratorParser(response.data),
        }),
      );
    });
};
