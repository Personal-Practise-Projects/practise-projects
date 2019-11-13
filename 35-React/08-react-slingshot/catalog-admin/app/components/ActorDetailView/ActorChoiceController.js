import React from 'react';

import { getChoices } from '../../helpers/services';
import { UPDATE_ACTOR } from '../../actions/types';
import { UPDATE_STATUS } from '../../common/constants';

export class ActorChoiceController {
  constructor(actorDetailHandler) {
    this.actorDetailHandler = actorDetailHandler;
    this.ref = actorDetailHandler.ref;
    this.choices = { '#gender': {}, '#age': {} };
  }

  setEventListener = eventListener => {
    this.eventListener = eventListener;
  };

  getOptionalInfo = header => {};
  getExtraConfig = () => {};

  getExistingData = header => {
    switch (header.uid) {
      case '#gender': {
        const selected = Object.keys(this.choices[header.uid]).find(
          key => this.choices[header.uid][key]['selected'] === true,
        );
        return selected ? '' : this.ref.gender;
      }
      case '#age': {
        const selected = Object.keys(this.choices[header.uid]).find(
          key => this.choices[header.uid][key]['selected'] === true,
        );
        return selected ? '' : this.ref.age;
      }
    }
  };
  getChoices = (header, callback) => {
    switch (header.uid) {
      case '#gender':
        getChoices('gender', parsedData => {
          parsedData[this.ref.gender]
            ? (parsedData[this.ref.gender]['selected'] = true)
            : '';
          this.choices[header.uid] = parsedData;
          callback(parsedData);
        });
        break;
      case '#age':
      default:
        getChoices('age', parsedData => {
          parsedData[this.ref.age]
            ? (parsedData[this.ref.age]['selected'] = true)
            : '';
          this.choices[header.uid] = parsedData;
          callback(parsedData);
        });
        break;
    }
  };

  onAction = (header, value) => {
    if (this.getExistingData(header) !== value) {
      this.onUpdate(header, value, () => {
        this.eventListener(UPDATE_STATUS);
      });
    }
  };

  onUpdate = (header, updateWithData, callback) => {
    this.actorDetailHandler.onUpdate(header, updateWithData, callback);
  };
}
