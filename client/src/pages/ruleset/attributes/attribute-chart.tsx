import { Attribute, AttributeType, UpdateAttribute, useUpdateAttribute } from '@/libs/compass-api';
import { CellRendererProps, Grid, GridApi, GridColumn } from '@/libs/compass-core-composites';
import React, { useMemo, useRef, useState } from 'react';
import { attributeChartColumns, IAttribute } from './attribute-chart-columns';
import { RowControls } from './attribute-chart-row-controls';

interface Props {
  showVariation?: boolean;
  editable?: boolean;
  archetypeId?: string;
  attributes: Attribute[];
  loading?: boolean;
  setCopiedAttributeTitle?: (title: string) => void;
  style?: React.CSSProperties;
  handleUpdate: (input: Omit<UpdateAttribute, 'rulesetId'>) => void;
  isItem?: boolean;
}

const attributeTypeToLabel = new Map<string, string>([
  [AttributeType.BOOLEAN, 'Boolean'],
  [AttributeType.NUMBER, 'Number'],
  [AttributeType.TEXT, 'Text'],
  [AttributeType.ACTION, 'Action'],
]);

export const AttributeChart = ({
  editable = false,
  attributes,
  archetypeId,
  setCopiedAttributeTitle,
  handleUpdate,
  isItem,
}: Props) => {
  const { updateAttributes } = useUpdateAttribute(5000);
  const [copiedLogic, setCopiedLogic] = useState<string | null>(null);

  const chartColumns = isItem
    ? attributeChartColumns.filter((col) => col.field !== 'type' && col.field !== 'defaultValue')
    : attributeChartColumns;

  let gridCols = !editable
    ? chartColumns
    : chartColumns.map((col) => ({
        ...col,
        editable: true,
      }));

  gridCols.push({
    field: 'controls',
    headerName: 'Controls',
    editable: false,
    minWidth: 240,
    sortIndex: 7,
  });

  const [_sortedColumns, setSortedColumns] = useState<GridColumn<IAttribute>[]>(gridCols);
  const sortedColumns: GridColumn<IAttribute>[] = useMemo(
    () =>
      [...gridCols]
        .map((c) => {
          if (c.field !== 'controls') return c;
          return {
            ...c,
            cellRenderer: (params: CellRendererProps<IAttribute>) => (
              <RowControls
                attributeId={params.data.id}
                isItem={isItem}
                copiedLogic={copiedLogic}
                setCopiedLogic={setCopiedLogic}
                setCopiedAttributeTitle={setCopiedAttributeTitle}
              />
            ),
          };
        })
        .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0)),

    [copiedLogic, _sortedColumns, chartColumns, isItem],
  );

  const rows: IAttribute[] = useMemo(
    () =>
      attributes.map((a) => {
        const variation = JSON.parse(a.variation ?? '{}');
        return {
          id: a.id,
          archetypeId: archetypeId ?? '',
          name: a.name,
          type: (attributeTypeToLabel.get(a.type) ?? a.type) as AttributeType,
          category: a.category,
          description: a.description,
          source: a.source ?? '-',
          defaultValue: `${a.defaultValue}${
            variation.defaultValue ? ` (${variation.defaultValue})` : ''
          }`,
          variation: a.variation,
        };
      }),
    [attributes.length, isItem],
  );

  const draggedOutsideGrid = useRef<boolean>(false);
  const columnMoved = useRef<boolean>(false);

  const onMove = async (api: GridApi) => {
    const newListOrder: Omit<UpdateAttribute, 'rulesetId'>[] = [];

    const nodes: Attribute[] = [];

    api.forEachNode((node: { data: IAttribute }) => {
      const attribute = attributes.find((i) => i.id === node.data.id);
      if (attribute) nodes.push(attribute);
    });

    nodes.forEach((attribute, i) => {
      const nextNode = nodes[i + 1];
      newListOrder.push({
        id: attribute.id,
        sortChildId: nextNode?.id ?? null,
      });
    });

    updateAttributes(newListOrder);
  };

  return (
    <Grid
      rowData={rows}
      colDefs={sortedColumns}
      onCellValueChanged={handleUpdate}
      onDragEnd={onMove}
      onColumnMoved={() => (columnMoved.current = true)}
      onDragStopped={(api: GridApi) => {
        // When an attr is dragged outside the grid
        // onDragStopped is also called when columns are arranged, so only
        // fire onMove if the attr was dragged outside the grid
        if (draggedOutsideGrid.current) {
          onMove(api);
          draggedOutsideGrid.current = false;
        } else if (columnMoved.current) {
          setSortedColumns((prev) =>
            prev.map((col) => ({
              ...col,
              sortIndex: api.getAllDisplayedColumns()?.findIndex((c) => c.getColId() === col.field),
            })),
          );
          columnMoved.current = false;
        }
      }}
      onDragLeave={() => (draggedOutsideGrid.current = true)}
      onDragEnter={() => (draggedOutsideGrid.current = false)}
    />
  );
};
