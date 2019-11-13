import React from 'react';
import { LocationSearch, ProductSearch, PropSearch, } from '../../../actions/search/commonSearchActions';

import { getCategoryList, getColorList, getSetUpList, } from '../../../helpers/services';
import { getAllowedToStatusList } from '../../ShotDetailsView/helper';
import { categoryOptions } from '../../ShotDetailsView/parser';
import { TalentController } from './talentController';
import { ConfirmBulkUpdateFieldsController } from './confirmBulkUpdateFieldsController';
import { BULK_ACTIONS } from '../constants';
import { formatDateToString } from '../../../helpers/common';
import { CHOICE_FIELDS, DATE_FORMAT, DATE_TIME_FORMAT, } from '../../../common/constants';
import { StringHelper } from '../../../helpers/utils';
import { BaseBulkUpdate } from './base';
import { BulkUpdateChoiceController } from './bulkUpdateChoiceController';
import { BulkCollaboratorsController } from "./bulkCollaboratorsContoller";
import { FIELDS_UID } from "../common/constants";


export class EditBulkUpdateFieldsController extends BaseBulkUpdate {
  constructor(prev, shots) {
    super();
    this.prev = prev;
    this.next = new ConfirmBulkUpdateFieldsController(shots);
    this.next.prev = this;
    this.ref = {};
    this.dropDownOptions = {
      '#color_tag': [],
      '#category': [],
      '#setUp': [],
      '#status': [],
    };
    this.dataVersion = -1;
    this.headers = [];
    this.type = 'SHOT_EDIT';
    this.nextLabel = 'Next';
    this.prevLabel = 'Back';
    this.__colorList({ uid: '#color_tag' }, null);
    this.mandatoryFileds = ['#color_tag', '#status', '#setUp'];
    this.talentRef = null;
    this.choiceController = null;
  }

  getExistingData = header => {
    switch (header.uid) {
      case FIELDS_UID.COLLABORATORS:
        return new BulkCollaboratorsController(header.choices);
      case '#category':
      case '#setUp':
      case '#status': {
        return this.ref[header.data_key] && this.ref[header.data_key].id;
      }
      case '#color_tag': {
        const value =
          (this.ref[header.data_key] && this.ref[header.data_key].name) ||
          this.colorDefaultValue.name;
        return value || this.colorDefaultValue.name;
      }
      case '#talents':
        if (this.talentRef) {
          return this.talentRef;
        }
        this.talentRef = new TalentController(this.next.shots[0], this.ref);
        return this.talentRef;
      case '#prop_list':
      case '#product_list':
        return this.ref[header.data_key] || [];
      case '#location_list': {
        if (this.ref[header.data_key]) {
          return [this.ref[header.data_key]];
        }
        return [];
      }
      case CHOICE_FIELDS.CHOICE_SECTION:
        this.choiceController = new BulkUpdateChoiceController(this);
        return this.choiceController;
      default: {
        return this.ref[header.data_key];
      }
    }
  };

  getOptionalInfo = (header, callback) => {
    switch (header.uid) {
      case '#status':
        this.dropDownOptions[header.uid] = getAllowedToStatusList();
        callback && callback(this.dropDownOptions[header.uid]);
        break;
      case '#setUp':
        getSetUpList(parsedData => {
          this.dropDownOptions[header.uid] = parsedData;
          callback && callback(this.dropDownOptions[header.uid]);
        });
        break;
      case '#category':
        getCategoryList(parsedData => {
          this.dropDownOptions[header.uid] = categoryOptions(null, parsedData);
          callback && callback(this.dropDownOptions[header.uid]);
        });
        break;
      case '#color_tag':
        this.__colorList(header, callback);
        break;
    }
  };

  getDropDownTitle = (header, value) => {
    const headerData =
      this.dropDownOptions[header.uid] &&
      this.dropDownOptions[header.uid].find(data => data.id === value);
    return headerData && headerData.title;
  };

  getSearchAPI = header => {
    switch (header.uid) {
      case '#product_list':
        const brands = [];
        this.next.shots.forEach(shots => !brands.includes(shots.brand.id) && brands.push(shots.brand.id));
        if (brands.length === 1) {
          return new ProductSearch(
            this.next.shots.length ? this.next.shots[0].brand.id : null,
          );
        }
        return null;
      case '#prop_list':
        return PropSearch();
      case '#location_list':
        return LocationSearch();
    }
  };

  onDelete = header => {
    delete this.ref[header.data_key];
  };

  onUpdate = (header, updateWithData) => {
    switch (header.uid) {
      case '#status':
      case '#category':
      case '#setUp':
      case '#color_tag':
        this.ref[header.data_key] = this.dropDownOptions[header.uid].find(
          option => option.id === updateWithData,
        );
        break;
      default:
        this.ref[header.data_key] = updateWithData;
    }
  };

  getDisplayData(header) {
    switch (header.uid) {
      case '#status':
      case '#category':
      case '#setUp':
        return this.ref[header.data_key] ? this.ref[header.data_key].title : '';
      case '#color_tag':
        return this.ref[header.data_key] ? this.ref[header.data_key].name : '';
      case '#due_date':
        return formatDateToString(this.ref[header.data_key], DATE_FORMAT);
      case '#schedule_on':
        return formatDateToString(this.ref[header.data_key], DATE_TIME_FORMAT);
      case '#location_list':
        return this.ref[header.data_key] ? this.ref[header.data_key].name : '';
      default:
        return this.ref[header.data_key];
    }
  }

  applyNext = callbackRef => {
    const selectedValues = [];
    this.headers.map(header => {
      const value = this.ref[header.data_key];
      if (this.mandatoryFileds.indexOf(header.uid) === -1 || value) {
        switch (header.uid) {
          case '#talents':
            value.map(talent => {
              selectedValues.push(
                this.displayDataBuilder(
                  header.uid,
                  talent.type,
                  this.getActorNames(talent),
                  header.data_key,
                  talent,
                ),
              );
            });
            break;
          case FIELDS_UID.COLLABORATORS:
            selectedValues.push(header);
            break;
          case CHOICE_FIELDS.CAMERA_ANGLE:
          case CHOICE_FIELDS.LIGHTING:
          case CHOICE_FIELDS.CROPPING:
          case CHOICE_FIELDS.SHADOWS:
            this.choiceController.getChoices(header, choices => {
              selectedValues.push(
                this.displayDataBuilder(
                  header.uid,
                  header.title,
                  this.getDisplayData(header) || null,
                  header.data_key,
                  choices[value] || value,
                ),
              );
            });
            break;
          default:
            selectedValues.push(
              this.displayDataBuilder(
                header.uid,
                StringHelper.capitalize(header.title.replace('Select ', '')),
                this.getDisplayData(header),
                header.data_key,
                value || null,
              ),
            );
        }
      }
    });
    this.next.setHeaders(selectedValues);
    callbackRef && callbackRef(BULK_ACTIONS.NEXT_LOAD);
  };

  getActorNames = talent => {
    const talentList = talent.actor.map(function(value) {
      return value.name;
    });
    return talentList.join(', ');
  };

  displayDataBuilder = (uid, title, subtitle, data_key, data) => {
    return {
      uid: uid,
      title: title,
      subtitle: subtitle,
      data_key: data_key,
      data: data,
    };
  };

  applyBack = callbackRef => {
    callbackRef && callbackRef(BULK_ACTIONS.PREV_LOAD);
  };

  __colorList(header, callback) {
    getColorList('SHOT_DETAILS', parsedData => {
      this.dropDownOptions[header.uid] = parsedData;
      callback && callback(this.dropDownOptions[header.uid]);
      this.colorDefaultValue = this.dropDownOptions[header.uid][0];
    });
  }
}
