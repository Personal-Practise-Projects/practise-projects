export function buildOptionChoice(existingCategory, shotCategoriesOptions) {
  let selectedCategory = null;
  if (existingCategory) {
    selectedCategory = shotCategoriesOptions && shotCategoriesOptions.find(
      data => data.id === existingCategory.id
    );
  }
  return !existingCategory || selectedCategory ? shotCategoriesOptions : [
    existingCategory, ...shotCategoriesOptions
  ];
}
