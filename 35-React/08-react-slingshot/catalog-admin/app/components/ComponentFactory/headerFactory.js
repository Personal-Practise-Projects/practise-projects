import React from 'react';

import VerticalSeparator from '../VerticalSeparator';
import Button from '../Button';
import LockUnlockView from '../LockUnlock';
import DropDown from '../DropDown';
import Span from '../Span';
import { HorizontalFeatures } from '../SidePanelHeaderView/horizontalFeatures';

const COMPONENTS_MAP = {
  horizontalActions: HorizontalFeatures,
  verticalSeparator: VerticalSeparator,
  lockUnlock: LockUnlockView,
  dropdown: DropDown,
  span: Span,
  button: Button,
};

export default function HeaderRenderFactory(header, key, dataHandler) {
  const component = COMPONENTS_MAP[header.type];
  const Component = component || '';

  return (
    Component && (
      <Component
        id={key}
        key={`${dataHandler.ref.id}_${key}`}
        header={header}
        dataHandler={dataHandler}
      />
    )
  );
}
