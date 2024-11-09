import { GridColumn } from '@/libs/compass-core-composites';
import { generateId } from '@/libs/compass-web-utils';

interface IGenericGridRow {}

export const getHeaderRow = (rows: string[], editable = true): GridColumn<IGenericGridRow>[] => {
  return rows.map((row) => ({
    field: row,
    headerName: row,
    width: 150,
    editable,
    filter: true,
  }));
};

export const buildRows = (rows: string[][], headerRow: string[]) => {
  return !rows.length
    ? []
    : rows.slice(1).map((valueArray) => {
        const row: any = {};

        valueArray.forEach((value, index) => {
          row[headerRow[index]] = value;
        });

        row._id = generateId();

        return row;
      });
};
