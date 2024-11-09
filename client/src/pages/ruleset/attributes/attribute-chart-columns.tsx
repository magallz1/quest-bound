import { AttributeType } from '@/libs/compass-api';
import { GridColumn } from '@/libs/compass-core-composites';

export type IAttribute = {
  id: string;
  archetypeId: string;
  name: string;
  type: AttributeType;
  category?: string | null;
  description?: string | null;
  source: string;
  defaultValue: string;
  maxValue?: number | null;
  variation?: string | null;
};

export const attributeChartColumns: GridColumn<IAttribute>[] = [
  {
    field: 'name',
    headerName: 'Name',
    editable: true,
    filter: true,
    rowDrag: true,
    sortIndex: 0,
  },
  {
    field: 'type',
    headerName: 'Type',
    editable: true,
    filter: true,
    width: 100,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: ['Number', 'Text', 'Boolean', 'Action'],
    },
    sortIndex: 1,
  },
  {
    field: 'defaultValue',
    headerName: 'Default',
    editable: true,
    filter: true,
    width: 100,
    sortIndex: 2,
  },
  {
    field: 'category',
    headerName: 'Category',
    editable: true,
    filter: true,
    width: 100,
    sortIndex: 4,
  },
  {
    field: 'description',
    headerName: 'Description',
    editable: true,
    cellEditor: 'agLargeTextCellEditor',
    cellEditorPopup: true,
    sortIndex: 5,
  },
  {
    field: 'source',
    headerName: 'Source',
    editable: false,
    filter: true,
    width: 100,
    sortIndex: 6,
  },
];
