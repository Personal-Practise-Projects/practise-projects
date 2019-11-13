import { DATE_PICKER_FORMAT } from '../../common/constants';
import { SLIDE_TYPE } from '../../components/Slider/Slides/constants';

export const assigneeListConfig = {
  appearance: 'stack',
  onAvatarClick: '',
  maxCount: 6,
  size: 'medium',
  key: 1,
  borderColor: '#f0edf1',
};

export const datePickerConfig = {
  key: 1,
  header: {
    title: '',
    uid: '#datePicker',
    placeholder: '',
    isClearable: false,
    showTimePicker: false,
    dateFormat: DATE_PICKER_FORMAT,
    date: new Date().getTime(),
  },
  popperPlacement: 'bottom',
  popperModifiers: {
    offset: {
      enabled: true,
      offset: '5px, 10px',
    },
    preventOverflow: {
      enabled: true,
      escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
      boundariesElement: 'viewport',
    },
  },
};

export const smallSlideConfig = {
  width: '130px',
  height: '95px',
  slide_type: SLIDE_TYPE.IMAGE_WITH_TEXT,
  innerClass: 'slide',
};

export const largeSlideConfig = {
  width: '300px',
  height: '300px',
  slide_type: SLIDE_TYPE.IMAGE_WITH_TEXT,
  innerClass: 'slide',
};
