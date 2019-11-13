export function parseChoices(choices) {
  choices.forEach(choice => {
    choice.checked = false;
    choice.title = choice.name || choice.title;
  });
  return choices;
}
