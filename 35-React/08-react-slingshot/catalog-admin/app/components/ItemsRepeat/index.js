import React from 'react';

function ItemsRepeat(props) {
  const limit = props.limit ? props.limit : props.items.length;
  return (
    props.items.length > 0 &&
    props.items
      .slice(0, limit)
      .map((item, index) => props.children(item, index))
  );
}

export default ItemsRepeat;
