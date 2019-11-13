import React from 'react';
import { APPLY, CANCEL } from '../constant';

export default function FilterFooter(props) {
  return (
    <div className="footer">
      <button
        onClick={() => props.eventListener(CANCEL)}
        className="cta secondary-cta"
      >
        Cancel
      </button>
      <button
        onClick={() => props.eventListener(APPLY)}
        className="cta primary-cta"
      >
        Apply
      </button>
    </div>
  );
}
