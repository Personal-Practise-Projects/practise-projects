import { StringHelper } from "../../../helpers/utils";

export function __selectCollaborator(user) {
  this.checked = true;
  this.selectedData = null;
  this.originalData = null;
  this.uid = this.name;
  if (user) {
    this.uid = StringHelper.format('##_##', this.name, user.id);
    this.selectedData = user;
    this.originalData = { id: this.name, user: user, role: this };
  }
}

function __unselectCollaborator() {
  this.selectedData = null;
  this.originalData = null;
  this.uid = this.name;
  this.checked = false;
}


export function parseBulkShotCollaboratorChoices(choices) {
  choices.map(choice => {
    choice.selectedData = null;
    choice.originalData = null;
    choice.uid = choice.name;
    choice.onUnselected = __unselectCollaborator.bind(choice);
    choice.onSelected = __selectCollaborator.bind(choice);
  });
  return choices;
}
