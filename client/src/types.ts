import { TreeItem } from '@/libs/compass-core-composites';

export type RulesetEntity =
  | 'sheet-templates'
  | 'page-templates'
  | 'charts'
  | 'attributes'
  | 'archetypes'
  | 'documents'
  | 'items';

export type PageTreeItem = Omit<TreeItem, 'children'> & {
  parentId: string | null;
  sortIndex: number;
  children: PageTreeItem[];
};
