import { EDIT_CONTENT_TYPES } from "../../common/constants";
import React from "react";

export default function AddVersionCta(props) {
  const isDisabled = !(
    (props.editedImage.images[EDIT_CONTENT_TYPES.PUBLIC] && props.editedImage.images[EDIT_CONTENT_TYPES.PUBLIC].url)
    || (props.editedImage.images[EDIT_CONTENT_TYPES.ROW] && props.editedImage.images[EDIT_CONTENT_TYPES.ROW].url)
  );
  const ctaTitle = isDisabled ? 'New version can be added only after uploading edited raw or public' : '';
  return (
    <button
      className="secondary-cta version-cta"
      disabled={isDisabled}
      title={ctaTitle}
      onClick={() => props.callbackRef(props.extraConfig)}
      type="button"
    >
      <i className="icon-circle-plus"/> Add version
    </button>
  );
};
