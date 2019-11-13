import { SET_EDITED_VERSION_ID } from "../../actions/types";

export function setEditedVersionId(payload){
  return {
    type: SET_EDITED_VERSION_ID,
    payload
  }
}
