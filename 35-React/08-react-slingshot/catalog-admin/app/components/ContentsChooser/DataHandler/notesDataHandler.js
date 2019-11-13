import {
  EDIT_CONTENT_TYPES,
  EDITED_CONTENT_ACTIONS,
} from '../common/constants';
import { STATUS_DONE } from '../../../actions/types';

export class NotesDataHandler {
  constructor(ref, injector) {
    this.ref = ref;
    this.refId = ref.id;
    this.injector = injector;
  }

  getExistingData = header => this.ref && this.ref.notes;

  getHeader = () => ({
    title: 'Notes',
    placeholder: 'Add notes',
    readonly: !(
      this.ref.images[EDIT_CONTENT_TYPES.PUBLIC].status ||
      this.ref.images[EDIT_CONTENT_TYPES.ROW].status
    ),
  });

  onUpdate = (header, newValue) => {
    const publicFile = this.ref && this.ref.images[EDIT_CONTENT_TYPES.PUBLIC];
    this.ref.notes = newValue;
    const config = {
      data: JSON.stringify({ notes: newValue }),
    };
    this.injector.performAction(
      EDITED_CONTENT_ACTIONS.UPDATE_CONTENT_NOTES,
      publicFile,
      config,
      (status, result) => {
        if (status === STATUS_DONE) {
          Object.assign(this.ref, result);
        }
      },
    );
  };
}
