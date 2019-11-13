import React from 'react';
import OwlCarousel from 'react-owl-carousel';
import { SlideWrapper } from './style';
import ItemsRepeat from '../ItemsRepeat';
import { TitledDescriptionIcon } from './Slides/TitledDescriptionIcon';
import { ImageWithText } from './Slides/ImageWithText';

import './Slider.scss';

export default function Slider(props) {
  const { title, width, height, slidesData, slide_type, noOfSlides } = props;
  const Slide = SLIDE_COMPONENT[slide_type];
  const outerClass = props.outerClass || '';
  const innerClass = props.innerClass || '';

  const sliderArrows = [
    '<i class="icon icon-caret-left"/>',
    '<i class="icon icon-caret-right"/>',
  ];

  return (
    <div className={`slider-component ${outerClass}`}>
      {title && <h1 className="heading">{title}</h1>}
      <div className="slider">
        <OwlCarousel
          margin={20}
          autoplaySpeed={false}
          autoplayTimeout={5000}
          nav
          items={noOfSlides}
          navText={sliderArrows}
          dotsContainer=".slider-navigation"
        >
          <ItemsRepeat items={slidesData}>
            {(item, index) => (
              <SlideWrapper
                key={index}
                className={`${innerClass}`}
                width={width}
              >
                <Slide slide={item} width={width} height={height} />
              </SlideWrapper>
            )}
          </ItemsRepeat>
        </OwlCarousel>
      </div>
    </div>
  );
}

export const SLIDE_COMPONENT = {
  IMAGE_WITH_TEXT: ImageWithText,
  ICON_WITH_TITLE_AND_DESCRIPTION: TitledDescriptionIcon,
};
