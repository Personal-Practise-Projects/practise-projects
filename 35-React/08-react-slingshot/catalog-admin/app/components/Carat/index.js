import React from 'react';

export default function Carat(props) {
  const styles = {
    width: props.size,
    height: props.size,
    backgroundColor: props.color,
    borderRadius: props.radius,
  };
  return <div className={props.className} style={styles} />;
}
