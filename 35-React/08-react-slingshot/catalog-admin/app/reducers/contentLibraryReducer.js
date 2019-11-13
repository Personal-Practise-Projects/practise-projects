import {
  FETCH_BRANDS,
  FETCH_CONTENTS,
  FETCH_SHOT_LIST,
  FETCH_PHOTO_LIST,
  SET_BRAND,
  SET_CONTENT,
  SET_SHOT,
  SET_TIMELINE_STATUS,
  SET_PHOTO_DETAIL,
} from '../actions/types';

export const CONTENT_LIBRARY_DEFAULT_STATE = {
  brand: {
    id: 0,
    name: 'Brands',
  },
  brandList: [],
  content: {
    id: 0,
    name: 'All',
  },
  contentList: [],
  shot: {
    id: 0,
    name: 'All',
  },
  shotList: [],
  photoDetail: { added: false },
  photoList: [],
  timeline: {
    status: '',
  },
};

export function contentLibraryReducer(
  state = CONTENT_LIBRARY_DEFAULT_STATE,
  { type, payload },
) {
  switch (type) {
    case FETCH_BRANDS: {
      state.brandList = payload;
      if (state.brandList.length === 0) {
        state.brand = { id: 0, name: 'Brands' };
      } else {
        // If the list updates then change the selected brand to the first item in the new list
        // UNLESS, the user already has a brand selected AND that brand is still in the new list.
        const noBrandSelected = state.brand.id === 0;
        const brandDoesNotExistsInList = !state.brandList.includes(
          brand => brand.id === state.brand.id,
        );

        if (noBrandSelected || brandDoesNotExistsInList) {
          state.brand = {
            id: state.brandList[0].id,
            name: state.brandList[0].name,
          };
        }
      }
      return state;
    }
    case FETCH_CONTENTS:
      state.contentList = payload;
      // If the contentList contains any items then select the first item and set the id, name, and status
      if (state.contentList.length > 0) {
        state.content = {
          id: state.contentList[0].id,
          name: state.contentList[0].name,
        };
        state.timeline = {
          status: state.contentList[0].status,
        };
      } else {
        // state content and timeline status to default
        state.content = { id: 0, name: 'All' };
        state.timeline = { status: '' };
      }
      return state;
    case FETCH_SHOT_LIST:
      state.shotList = payload;
      state.shot = { id: 0, name: 'All' };
      return state;
    case FETCH_PHOTO_LIST:
      state.photoList = payload;
      return state;
    case SET_BRAND:
      state.brand = payload;
      return state;
    case SET_CONTENT:
      state.content = payload;
      return state;
    case SET_SHOT:
      state.shot = payload;
      return state;
    // TODO: remove this if status of the image can be changed
    case SET_PHOTO_DETAIL:
      state.photoDetail = payload;
      return state;
    case SET_TIMELINE_STATUS:
      state.timeline.status = payload;
      return { ...state };
    default:
      return state;
  }
}
