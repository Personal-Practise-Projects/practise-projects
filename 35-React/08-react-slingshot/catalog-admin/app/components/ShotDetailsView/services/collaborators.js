import AxiosBuilder from "../../../common/axiosBuilder";
import {
  COLLABORATOR_USERS,
  DELETE_SHOT_COLLABORATOR,
  DONE,
  FAILED,
  SHOT_COLLABORATOR,
  SHOT_COLLABORATOR_TYPES
} from '../../../common/constants';
import BaseSearchHelper from '../../../actions/search/base';
import { SEARCH_KEYS } from '../../../actions/search/constants';
import { StringHelper } from "../../../helpers/utils";
import { usersListParser } from "../../../actions/search/helpers";

export function getCollaboratorTypeSearch() {
  return new BaseSearchHelper(
    SHOT_COLLABORATOR_TYPES,
    __parseShotsCollaboratorChoicesData,
    [],
    SEARCH_KEYS.COLLABORATOR_TYPES,
  );
}

export function getCollaboratorsSearch(collaboratorType) {
  return new BaseSearchHelper(
    StringHelper.formatKeyArguments(
      COLLABORATOR_USERS, { collaboratorType: collaboratorType }
    ),
    usersListParser,
    ['name'],
    StringHelper.format('##_##', SEARCH_KEYS.COLLABORATOR_USERS, collaboratorType),
    {},
    true,
    false,
    false,
  );
}

export function getShotCollaborators(shotId, choices, callback) {
  new AxiosBuilder(
    StringHelper.formatKeyArguments(SHOT_COLLABORATOR, { shotId: shotId })
  ).fetch().then(response => {
    __parseShotsCollaboratorData(choices, response.data, callback);
  }).catch(error => {
    callback && callback(FAILED, error);
  });
}

export function createShotCollaborators(shotId, choices, roleId, userId, callback) {
  const config = {
    data: JSON.stringify({ role: roleId, user: userId }),
  };
  new AxiosBuilder(
    StringHelper.formatKeyArguments(SHOT_COLLABORATOR, { shotId: shotId }), config
  ).POST().then(response => {
    __parseShotsCollaboratorData(choices, response.data, callback);
  }).catch(error => {
    callback && callback(FAILED, error);
  });
}

export function deleteShotCollaborator(shotId, choices, collaboratorId, callback) {
  new AxiosBuilder(
    StringHelper.formatKeyArguments(DELETE_SHOT_COLLABORATOR,
      { shotId: shotId, collaboratorId: collaboratorId })
  ).DELETE().then(response => {
    __parseShotsCollaboratorData(choices, response.data, callback);
  }).catch(error => {
    callback && callback(FAILED, error);
  });
}

function __parseShotsCollaboratorData(choices, data, callback) {
  if (choices && choices.length > 0) {
    choices.map(choice => {
      choice.selectedData = null;
      choice.originalData = null;
      choice.uid = choice.name;
      const selectedData = data.find(existingValue => existingValue.role.id === choice.id);
      if (selectedData) {
        choice.uid = selectedData.id;
        choice.selectedData = selectedData.user;
        choice.originalData = selectedData;
      }
    });
  }
  callback && callback(DONE, choices, data);
  return choices;
}

function __parseShotsCollaboratorChoicesData(response) {
  return response.data.map(choice => (
    {
      placeholder: 'Select user',
      type: 'dropdown',
      uid: choice.name,
      ...choice
    }
  ));
}
