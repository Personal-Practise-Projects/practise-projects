import {
  ACTOR_IMAGES,
  BRAND_REFERENCES,
  LOCATION_IMAGES,
  PRODUCT_IMAGES,
  PROP_IMAGES,
  SHOT_CONTENT,
  SHOT_EDITED_CONTENT,
  SHOT_PRODUCED_CONTENT,
  SHOT_REFERENCES_IMAGES,
} from '../actions/types';
import RecentContentController from './recentContents';
import ReferenceImagesController from './referenceImages';
import ActorImagesController from './actorImages';
import EditedImagesController from './editedContents';
import LocationImagesController from './locationImages';
import PropImagesController from './propImages';
import { ON_DONE_WIDGET_STATE } from '../index';
import ProductImagesController from './productImages';
import BrandReferencesController from './brandReferences';

export function dataReducersFactory(pickerType, widgetListener, ref) {
  const uploadWidget = {};
  const injectors = {};
  switch (pickerType) {
    case SHOT_CONTENT:
      injectors[SHOT_PRODUCED_CONTENT] = new RecentContentController(widgetListener, ref);
      injectors[SHOT_EDITED_CONTENT] = new EditedImagesController(widgetListener, ref);
      uploadWidget.injectors = injectors;
      uploadWidget.type = ON_DONE_WIDGET_STATE.NON_CLOSABLE;
      break;
    case SHOT_REFERENCES_IMAGES:
      injectors[SHOT_REFERENCES_IMAGES] = new ReferenceImagesController(
        widgetListener,
        ref,
      );
      uploadWidget.injectors = injectors;
      uploadWidget.type = ON_DONE_WIDGET_STATE.DEFAULT;
      break;
    case ACTOR_IMAGES:
      injectors[ACTOR_IMAGES] = new ActorImagesController(widgetListener, ref);
      uploadWidget.injectors = injectors;
      uploadWidget.type = ON_DONE_WIDGET_STATE.DEFAULT;
      break;
    case LOCATION_IMAGES:
      injectors[LOCATION_IMAGES] = new LocationImagesController(widgetListener, ref);
      uploadWidget.injectors = injectors;
      uploadWidget.type = ON_DONE_WIDGET_STATE.DEFAULT;
      break;
    case PROP_IMAGES:
      injectors[PROP_IMAGES] = new PropImagesController(widgetListener, ref);
      uploadWidget.injectors = injectors;
      uploadWidget.type = ON_DONE_WIDGET_STATE.DEFAULT;
      break;
    case PRODUCT_IMAGES:
      injectors[PRODUCT_IMAGES] = new ProductImagesController(widgetListener, ref);
      uploadWidget.injectors = injectors;
      uploadWidget.type = ON_DONE_WIDGET_STATE.DEFAULT;
      break;
    case BRAND_REFERENCES:
      injectors[BRAND_REFERENCES] = new BrandReferencesController(widgetListener, ref);
      uploadWidget.injectors = injectors;
      uploadWidget.type = ON_DONE_WIDGET_STATE.DEFAULT;
  }
  return uploadWidget;
}
