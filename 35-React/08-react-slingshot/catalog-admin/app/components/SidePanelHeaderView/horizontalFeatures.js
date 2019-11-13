import React from "react";
import HeaderRenderFactory from "../ComponentFactory/headerFactory";
import VerticalSeparator from "../VerticalSeparator";


let getFeatureComponent = function (index, count, feature, props) {
  return <React.Fragment>
    {HeaderRenderFactory(feature, feature.uid, props.dataHandler)}
    {index !== count && <VerticalSeparator/>}
  </React.Fragment>;
};

export function HorizontalFeatures(props) {
  const totalCount = props.header.data.length - 1;
  return <div className="shot-controls d-flex align-items-center">
    {
      props.header.data.map((feature, index) => {
        return getFeatureComponent(index, totalCount, feature, props)
      })
    }
  </div>;
}
