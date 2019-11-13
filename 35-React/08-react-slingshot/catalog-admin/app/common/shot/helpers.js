import { StringHelper } from '../../helpers/utils';
import { formatDateToString } from '../../helpers/common';
import { TIME_FORMAT } from '../constants';

export function getLockConfig(shot) {
  let placeholder = 'Lock/unlock the shot details';
  if (shot.shot_info.locked_info.last_updated) {
    placeholder = StringHelper.format(
      'Last update on- ## | ##',
      formatDateToString(shot.shot_info.locked_info.last_updated.timestamp),
      formatDateToString(
        shot.shot_info.locked_info.last_updated.timestamp,
        TIME_FORMAT,
      ),
    );
  }
  return {
    placeholder,
    userInfo: shot.shot_info.locked_info.user_info,
  };
}

export function shotCollaboratorParser(collaboratorList) {
  const parsedCollaboratorList = {};
  collaboratorList.map(collaborator => {
    parsedCollaboratorList[collaborator.user.id] = {
      id: collaborator.user.id,
      email: collaborator.user.email,
      key: collaborator.user.email,
      name: collaborator.user.name || collaborator.user.email,
      src: collaborator.user.profile_picture_thumbnail.small,
      appearance: 'circle',
      size: 'small',
      enableTooltip: true,
      shots: collaborator.shot_ids,
    };
  });
  return parsedCollaboratorList;
}
