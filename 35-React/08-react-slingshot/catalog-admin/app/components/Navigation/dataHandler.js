// Define Various Types of Menu Items


export function createRouterLink(link) {
  return `/${link}`;
}

export function closeDropdowns() {
  const a = 'navigation-expanded';
  const b = 'navigation-collapsed';
  const elementList = document.getElementById('navigation-wrapper').childNodes;
  for (let index = 0; index < elementList.length; index++) {
    const el = elementList[index].classList;
    if (el.contains(a)) {
      el.remove(a);
      el.add(b);
    }
  }
  return false;
}
