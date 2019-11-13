import React from 'react';
import styled from 'styled-components';
import ReadMoreAndLess from 'react-read-more-less';

import Img from '../../../Img';
import LightBoxImage from '../../../LightBoxImage';
import { buildLightBoxFeatures } from '../../../AddImages/ImageNotesThumb/helper';
import { readMoreLessConfig } from '../../../../helpers/uiUtils';
import { CHAR_LIMITS } from "../../../../common/constants";

import './ImageWithText.scss';

export const DefaultImageWrapper = styled.div`
  width: ${props => props.width || 'auto'};
  height: ${props => props.height || 'auto'};
  margin-bottom: 6px;
  background: #e3dee6;
  border-radius: 5px;
  padding: 16px;
`;

export function ImageWithText(props) {
  return (
    <React.Fragment>
      {props.slide.imageExist ? (
        <LightBoxImage
          featureReference={buildLightBoxFeatures}
          url={props.slide.url}
          downloadUrl={props.slide.url}
          compressUrl={props.slide.compressUrl}
          thumbnail={props.slide.thumbnailUrl}
          width={props.width}
          height={props.height}
          alt="lightbox-image"
        />
      ) : (
        <DefaultImageWrapper width={props.width} height={props.height}>
          <Img src={props.slide.url} alt="No Image" className="default-image" />
        </DefaultImageWrapper>
      )}
      {props.slide.text && (
        <ReadMoreAndLess
          {...readMoreLessConfig(CHAR_LIMITS.EQUAL_TO_100)}
        >
          {props.slide.text}
        </ReadMoreAndLess>
      )}
    </React.Fragment>
  );
}
