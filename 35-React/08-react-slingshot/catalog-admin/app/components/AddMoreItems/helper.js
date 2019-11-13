import React from 'react';
import TypeQuantitySelect from "./typeQuantitySelect";
import TwoLevelSelect from "./twoLevelSelect";
import { StringHelper } from "../../helpers/utils";

const COMPONENT_MAP = {
  countSelect: TypeQuantitySelect,
  twoLevelSelect: TwoLevelSelect
};

export function getComponent(key, header, itemController) {
  const Component = COMPONENT_MAP[header.type];
  return <Component
    key={StringHelper.format('ami-component-##', key)}
    header={header}
    dataHandler={itemController}
  />
}
