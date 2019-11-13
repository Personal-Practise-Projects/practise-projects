import { getFirstLetterCapitalized } from "../helpers/common";

export function parseCategory(category) {
  return {
    id: category.id,
    title: `${getFirstLetterCapitalized(category.parent)}: ${category.name}`
  }
}
