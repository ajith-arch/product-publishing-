export function productEditHref(id: string, tab?: string) {
  const q = new URLSearchParams({ id });
  if (tab) q.set("tab", tab);
  return `/products/edit?${q.toString()}`;
}
