import React from 'react';

import AddImagesView from '../AddImages';
import Input from '../Input';
import CheckBox from '../CheckBox';
import InputChipSelect from '../InputChipSelect';
import SearchableDropDown from '../../form-components/SearchableDropDown';
import Section from '../Section';
import DatePicker from '../DatePicker';
import MultiTypeSelect from '../MultiTypeSelect';
import DropDown from '../DropDown';
import TextArea from '../TextArea';
import Span from '../../form-components/Span';
import InputInline from '../InputInline';
import AddMoreItems from '../AddMoreItems';
import Select from '../Select';
import CommentSection from '../CommentSection';
import CustomButton from '../../form-components/CustomButton';
import ColorToolTip from '../ColorToolTip';
import BulkLockUnlock from '../BulkLockUnlock';
import ChoiceSection from '../ChoiceSection';
import LabeledDropDown from '../LabeledDropDown';

const COMPONENTS_MAP = {
  addMoreImages: AddImagesView,
  addMoreItems: AddMoreItems,
  button: CustomButton,
  comment: CommentSection,
  checkBox: CheckBox,
  colorTooltip: ColorToolTip,
  date: DatePicker,
  dropdown: DropDown,
  input: Input,
  number: Input,
  row: InputInline,
  section: Section,
  selectedDropDown: Select,
  select: InputChipSelect,
  multiTypeSelect: MultiTypeSelect,
  searchableDropdown: SearchableDropDown,
  span: Span,
  textarea: TextArea,
  bulkLockUnlock: BulkLockUnlock,
  choiceSection: ChoiceSection,
  labeledDropDown: LabeledDropDown,
};

export default class ComponentRenderFactory {
  static component(header, key, dataHandler) {
    const component = COMPONENTS_MAP[header.type];
    const Component = component || '';

    return (
      Component && (
        <Component
          id={key}
          key={`${dataHandler.ref && dataHandler.ref.id}_${key}`}
          header={header}
          dataHandler={dataHandler}
        />
      )
    );
  }
}
