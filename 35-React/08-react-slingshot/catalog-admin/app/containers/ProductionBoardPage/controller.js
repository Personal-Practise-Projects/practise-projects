import { AVATAR_STAGE } from '../../common/constants';

export default class ShotCollaboratorController {
  constructor(stage) {
    this.stage = stage;
  }

  getScreenInfo() {
    return AVATAR_STAGE[this.stage];
  }
}
