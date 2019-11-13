import React, { useEffect } from "react";

function useKeyboardEventCustomHook(key, callback) {
  useEffect(() => {
    const handler = event => {
      if (event.key === key) {
        callback();
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);
}

export default function KeyDownListener({type, callback, children}) {
  useKeyboardEventCustomHook(type, callback);
  return children;
}
