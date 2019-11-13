import AxiosBuilder from '../../../common/axiosBuilder';
import {
  ACTOR_SEARCH,
  ACTOR_TYPE,
  DONE,
  FAILED,
} from '../../../common/constants';
import BaseSearchHelper from '../../../actions/search/base';
import { SEARCH_KEYS } from '../../../actions/search/constants';
import { StringHelper } from '../../../helpers/utils';

export function getActorTypeSearch() {
  return new BaseSearchHelper(
    ACTOR_TYPE,
    __actorTypeResponseParser,
    ['name'],
    SEARCH_KEYS.ACTOR_TYPE,
  );
}

function __actorTypeResponseParser(response) {
  const parsedData = [];
  response.data.map((talentType, index) => {
    parsedData.push({
      id: talentType.name,
      name: talentType.name,
      title: talentType.name,
    });
  });
  return parsedData;
}

export function getActorSearch(actorType) {
  return new BaseSearchHelper(
    ACTOR_SEARCH,
    __actorResponseParser,
    ['name'],
    actorType,
    { actor_type: actorType },
    true,
    false,
    false,
  );
}

function __actorResponseParser(response) {
  const parsedData = [];
  response.data.map(actor => {
    parsedData.push({
      id: actor.actor_data.id,
      name: actor.actor_data.name,
      thumbnail: actor.actor_data.images,
    });
  });
  return parsedData;
}

export function getTalentData(refId, callback) {
  new AxiosBuilder(StringHelper.format('/shot/##/actor/', refId))
    .fetch()
    .then(response => {
      const value = parseTalentSectionData(response.data);
      callback && callback(DONE, value);
    })
    .catch(error => {
      callback && callback(FAILED, error);
    });
}

export function updateActorGroup(data, refId, callback) {
  const config = {
    data: JSON.stringify(data),
  };
  new AxiosBuilder(StringHelper.format('/shot/##/actor/', refId), config)
    .POST()
    .then(response => {
      if (response.data && response.data.length > 0) {
        const group = response.data[0];
        parseGroupSectionData(group);
        callback && callback(DONE, group);
      } else {
        callback && callback(FAILED, response.data);
      }
    })
    .catch(error => {
      callback && callback(FAILED, error);
    });
}

export function deleteActorGroup(refId, groupId, callback) {
  new AxiosBuilder(
    StringHelper.format('/shot/##/actor-group/##/', refId, groupId),
  )
    .DELETE()
    .then(response => {
      const value = parseTalentSectionData(response.data);
      callback && callback(DONE, value);
    })
    .catch(error => {
      callback && callback(FAILED, error);
    });
}

export function deleteActor(data, refId, callback) {
  const config = {
    data: JSON.stringify(data),
  };
  new AxiosBuilder(StringHelper.format('/shot/##/actor/', refId), config)
    .DELETE()
    .then(response => {
      const value = parseTalentSectionData(response.data);
      callback(DONE, value);
    })
    .catch(error => {
      callback(FAILED, error);
    });
}

function parseTalentSectionData(actorData) {
  actorData.map(group => {
    parseGroupSectionData(group);
  });
  return actorData;
}

let parseGroupSectionData = function(group) {
  group.id = group.group;
  group.actor = group.actor.map(actor => ({
    id: actor.id,
    name: actor.name,
    images: actor.images,
  }));
};
