import { searchObject } from '../../helpers/common';

export const getIdArrayFromObjectArray = function(excludeFromList) {
  return excludeFromList.map(obj => obj.id);
};

export function filterResultForSearchedString(
  searchString,
  onFields,
  dataList,
  excludeFromList,
  callback,
) {
  excludeFromList = excludeFromList || [];
  const excludeObjectsIds = getIdArrayFromObjectArray(excludeFromList);
  let filterResult = dataList;
  if (searchString && onFields.length !== 0 && dataList.length !== 0) {
    filterResult = searchObject(dataList, searchString, onFields);
  }

  const queryset = filterResult.filter(
    obj => excludeObjectsIds.indexOf(obj.id) === -1,
  );
  callback && callback(searchString, queryset);
}


export const usersListParser = function (response) {
  return response.data.map(user => {
    user.thumbnail =
      user.profile_picture_thumbnail && user.profile_picture_thumbnail.large;
    delete user.profile_picture_thumbnail;
    user.name = `${user.name || ''} <${user.email}>`;
    return user;
  });
};
