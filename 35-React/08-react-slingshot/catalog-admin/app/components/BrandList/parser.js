export default function brandListParser(brands) {
  const parsedData = [];
  brands.map(brand => {
    parsedData.push({
      id: brand.id,
      name: {
        data: brand.name,
      },
      website: {
        data: brand.website,
      },
      instagram_handle: brand.instagram_handle,
      category_list: brand.category_list,
    });
  });
  return parsedData;
}
