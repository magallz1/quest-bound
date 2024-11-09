import { PageTreeItem } from '@/types';

export function buildPageTree(
  pages: PageTreeItem[],
  parentId: string | null = null,
): PageTreeItem[] {
  const tree: PageTreeItem[] = [];

  const sortedPages = pages.sort((a, b) => a.sortIndex - b.sortIndex);

  for (const page of sortedPages) {
    if (page.parentId === parentId) {
      const children = buildPageTree(pages, page.id);

      if (children.length > 0) {
        page.children = children.sort((a, b) => a.sortIndex - b.sortIndex);
      }

      tree.push(page);
    }
  }

  return tree;
}

export function filterTreeWithAncestorsByLabel(
  tree: PageTreeItem[],
  label: string,
): PageTreeItem[] {
  const filteredTree: PageTreeItem[] = [];

  for (const page of tree) {
    if (page.label.toLowerCase().includes(label.toLowerCase())) {
      const filteredPage: PageTreeItem = { ...page };

      if (page.children) {
        const filteredChildren = filterTreeWithAncestorsByLabel(page.children, label);
        if (filteredChildren.length > 0) {
          filteredPage.children = filteredChildren;
        }
      }

      filteredTree.push(filteredPage);
    } else if (page.children) {
      const filteredChildren = filterTreeWithAncestorsByLabel(page.children, label);
      if (filteredChildren.length > 0) {
        const pageWithChildren: PageTreeItem = { ...page, children: filteredChildren };
        filteredTree.push(pageWithChildren);
      }
    }
  }

  return filteredTree;
}
