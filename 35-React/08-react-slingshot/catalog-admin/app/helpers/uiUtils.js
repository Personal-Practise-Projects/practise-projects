export function showEllipsesText(element) {
  const needEllipsis = element.offsetWidth < element.scrollWidth;
  const hasTitleAttr = typeof element.getAttribute('title') !== 'undefined';
  if (needEllipsis === true) {
    element.setAttribute('title', element.val());
  } else if (needEllipsis === false && hasTitleAttr === true) {
    element.removeAttribute('title');
  }
}

export function readMoreLessConfig(limit) {
  return {
    className: 'read-more',
    charLimit: limit,
    readMoreText: 'more',
    readLessText: 'less',
  };
}
