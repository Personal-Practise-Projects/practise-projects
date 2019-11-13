import React from 'react';

import { useDropzone } from 'react-dropzone';
import { onDragHover } from "../EditImageComponent/helpers";
import { StringHelper } from "../../../helpers/utils";


function DragArea(props) {
  const refId = StringHelper.format('widget_component_drag_area##', props.refId);
  const { getRootProps, getInputProps } = useDropzone({
    accept: props.accept,
    onDrop: props.onDrop,
    onDragEnter: () => {
      onDragHover(refId, true);
    },
    onDragLeave: () => {
      onDragHover(refId, false);
    },
  });

  return (
    <div
      id={refId}
      {...getRootProps()}
      className="input-filedrop d-flex align-items-center justify-content-center"
    >
      <input {...getInputProps()} />
      <div className="filedrop-description">
        <span className="filedrop-illustration d-block"/>
        <div className="flex-wrapper">
          <span className="filedrop-text d-block">
            Drag or browse a file to upload
          </span>
          <span className="filedrop-text filedrop-text-secondary d-block">
            {props.displayMessage}
          </span>
        </div>
        {props.children}
      </div>
    </div>
  );
}

export default DragArea;
