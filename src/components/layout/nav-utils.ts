export interface NavCategory {
  id: string;
  slug: string;
  name: string;
  group: string;
}

export function groupCategories(categories: NavCategory[]) {
  const groups = new Map<string, NavCategory[]>();
  for (const c of categories) {
    const key = c.group || "Shop";
    groups.set(key, [...(groups.get(key) ?? []), c]);
  }
  return Array.from(groups.entries());
}
