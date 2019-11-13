import React from 'react';

import { useDropzone } from 'react-dropzone';

import { onDragHover } from "../EditImageComponent/helpers";
import { StringHelper } from "../../../helpers/utils";

import '../EditImageComponent/EditContentVariant/EditContentVariant.scss';

export default function SingleDropZone(props) {
  const refId = StringHelper.format('sdz_##', props.refId);
  const { getRootProps, getInputProps } = useDropzone({
    accept: props.accept,
    onDrop: props.onDrop,
    multiple: false,
    noDragEventsBubbling: false,
    onDragEnter: () => {

      onDragHover(refId, true);
    },
    onDragLeave: () => {
      onDragHover(refId, false);
    },
  });
  return (
    <div

      {...getRootProps()}
      className="input-filedrop d-flex align-items-center justify-content-center"
    >
      <input {...getInputProps()}
      />
      <div className="input-upload">
        <label id={refId} className="input-upload-label d-flex align-items-center justify-content-center">
          <span className="upload-icon d-inline-block"/>
        </label>
      </div>
    </div>
  );
}

