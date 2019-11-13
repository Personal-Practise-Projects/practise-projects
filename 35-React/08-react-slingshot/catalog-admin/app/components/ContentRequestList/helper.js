export const CONTENT_REQUEST_FILTER_MAP = {
  accountManager: getAccountManagerFilter,
};

export const CONTENT_REQUEST_FILTER_API_MAP = {
  accountManager: 'account_manager',
};

export function getContentRequestFilters() {
  return Object.keys(CONTENT_REQUEST_FILTER_MAP);
}

function getAccountManagerFilter(accountManagerList) {
  const filteredResult = [];
  Object.values(accountManagerList).map(user => {
    filteredResult.push(user.id);
  });
  return filteredResult.length ? filteredResult : null;
}
