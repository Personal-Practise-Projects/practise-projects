import {
  FETCH_BRANDS,
  FETCH_BRANDS_FAILED,
  FETCH_CONTENTS,
  FETCH_CONTENTS_FAILED,
  FETCH_SHOT_LIST,
  FETCH_SHOT_LIST_FAILED,
  FETCH_PHOTO_LIST,
  FETCH_PHOTO_LIST_FAILED,
  SET_BRAND,
  SET_CONTENT,
  SET_SHOT,
  SET_PHOTO_DETAIL,
  SET_TIMELINE_STATUS,
} from './types';
import {
  getAllBrands,
  getAllContents,
  getAllContentDetails,
} from '../containers/ContentLibraryPage/services/api';
import { formatDateToString } from '../helpers/common';

export const fetchBrands = () => dispatch => {
  getAllBrands()
    .then(response => {
      dispatch({
        type: FETCH_BRANDS,
        payload: response.data.results,
      });
    })
    .catch(error => {
      dispatch({
        type: FETCH_BRANDS_FAILED,
        payload: error,
      });
    });
};

export const fetchContents = brandId => dispatch => {
  getAllContents(brandId)
    .then(response => {
      if (response.data.content_requests) {
        const contentRequestList = [];
        response.data.content_requests.forEach(contentRequest => {
          contentRequestList.push({
            id: contentRequest.id,
            name: `CRID ${contentRequest.id} - ${formatDateToString(
              contentRequest.created_on.timestamp,
            )}`,
            date: contentRequest.created_on.timestamp,
            status: contentRequest.status,
          });
        });
        // reverse the order for shotList and combine with defaultList
        dispatch({
          type: FETCH_CONTENTS,
          payload: contentRequestList.reverse(),
        });
      }
    })
    .catch(error => {
      dispatch({
        type: FETCH_CONTENTS_FAILED,
        payload: error,
      });
    });
};

export const fetchShotList = (brandId, contentId) => dispatch => {
  getAllContentDetails(brandId, contentId)
    .then(response => {
      const shotList = [];
      const defaultList = [{ id: 0, name: 'All' }];
      response.data.results.forEach(shotDetail => {
        shotList.push({
          id: shotDetail.shot_details.shot_info.id,
          name: shotDetail.shot_details.shot_info.shot_number,
        });
      });
      // reverse the order for shotList and combine with defaultList
      const completeShotList = defaultList.concat(shotList.reverse());
      dispatch({
        type: FETCH_SHOT_LIST,
        payload: completeShotList,
      });
    })
    .catch(error => {
      dispatch({
        type: FETCH_SHOT_LIST_FAILED,
        payload: error,
      });
    });
};

// need to get shotId to check if the list has to be filtered down
export const fetchPhotoList = (brandId, contentId, shotId) => dispatch => {
  getAllContentDetails(brandId, contentId)
    .then(response => {
      const photoList = [];
      // First, get all the photos
      response.data.results.forEach(photoFile => {
        photoList.push({
          file: photoFile.file,
          ref_id: photoFile.ref_id,
          status: photoFile.status,
          category: photoFile.category,
          price: photoFile.price,
          id: photoFile.id,
          shotInfo: photoFile.shot_details.shot_info.id,
        });
      });
      if (shotId !== 0) {
        // shot is selected, so filter it down
        // Fetch the photos that are related to the shotId
        const filteredPhotoList = photoList.filter(
          shot => shotId === shot.shotInfo,
        );
        dispatch({
          type: FETCH_PHOTO_LIST,
          payload: filteredPhotoList,
        });
      } else {
        dispatch({
          type: FETCH_PHOTO_LIST,
          payload: photoList,
        });
      }
    })
    .catch(error => {
      dispatch({
        type: FETCH_PHOTO_LIST_FAILED,
        payload: error,
      });
    });
};

export const setBrand = ({ id, name }) => dispatch => {
  dispatch({
    type: SET_BRAND,
    payload: { id, name },
  });
};

export const setContent = ({ id, name }) => dispatch => {
  dispatch({
    type: SET_CONTENT,
    payload: { id, name },
  });
};

export const setShot = ({ id, name }) => dispatch => {
  dispatch({
    type: SET_SHOT,
    payload: { id, name },
  });
};

// TODO: remove this if status of the photo can be changed ('AVAILABLE' to 'ADDED_ON_CART')
export const setPhotoDetail = ({ added }) => dispatch => {
  dispatch({
    type: SET_PHOTO_DETAIL,
    payload: { added },
  });
};

export const setTimelineStatus = status => dispatch => {
  dispatch({
    type: SET_TIMELINE_STATUS,
    payload: status,
  });
};
