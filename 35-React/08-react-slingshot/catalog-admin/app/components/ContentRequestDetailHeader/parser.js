export function headerParser(contentRequest) {
  const parsedData = {};
  parsedData.status = {
    id: contentRequest.id,
    title: 'Select Status',
    data_key: 'status',
    uid: '#status',
  };
  return parsedData;
}

export function menuParser(contentRequest) {
  const parsedData = [];
  parsedData.push({
    data: `/content-request-details?q=${contentRequest.id}`,
    type: 'link',
    title: 'View details',
  });
  parsedData.push({
    data: contentRequest.library_link,
    type: 'external_link',
    title: 'View library',
    toolTip: 'No link available',
    className: `${contentRequest.library_link.includes('/') ? '' : 'disabled'}`,
  });
  parsedData.push({
    data: contentRequest.model_profile_link,
    type: 'external_link',
    title: 'View model profiles',
    toolTip: 'No model profiles to show',
    className: `${contentRequest.mapped_talent > 0 ? '' : 'disabled'}`,
  });

  return parsedData;
}
