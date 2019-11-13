import React, { useEffect } from 'react';


function useMouseEvent(callbackFn) {
  useEffect(() => {
    document.addEventListener('mousedown', callbackFn, false);
    return () => {
      document.removeEventListener('mousedown', callbackFn, false);
    };
  }, []);
}

export default function OnClickOutside(props) {
  useMouseEvent(props.callbackFn);
  return props.children;
}
