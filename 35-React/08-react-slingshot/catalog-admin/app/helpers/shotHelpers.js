import { getFirstLetterCapitalized } from './common';

export function buildCategoryOption(existingCategory, shotCategoriesOptions) {
  let selectedCategory = null;
  if (existingCategory) {
    selectedCategory =
      shotCategoriesOptions &&
      shotCategoriesOptions.find(data => data.id === existingCategory.id);
  }
  return !existingCategory || selectedCategory
    ? shotCategoriesOptions
    : [existingCategory, ...shotCategoriesOptions];
}

export const parseCategory = function(category) {
  return {
    id: category.id,
    title: `${getFirstLetterCapitalized(category.parent)}: ${category.name}`,
    parent: category.parent,
    name: category.name,
  };
};
