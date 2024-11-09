import { ChartComponentData } from '@/libs/compass-api';
import { Stack } from '@chakra-ui/react';
import { CSSProperties } from 'react';

export const ChartData = ({
  chartData,
  styles,
  defaultChart,
}: {
  chartData: string[][];
  styles: Partial<ChartComponentData>;
  defaultChart?: boolean;
}) => {
  const headerRow = chartData[0];

  const {
    headerBgColor,
    evenRowBgColor,
    oddRowBgColor,
    tableOutlineColor,
    rowHorizontalSpacing,
    rowVerticalSpacing,
  } = styles;

  const tableStyles: CSSProperties = {
    textAlign: 'center',
    padding: '1px',
    borderCollapse: 'separate',
    borderSpacing: `${parseInt(rowHorizontalSpacing ?? '')}px ${parseInt(
      rowVerticalSpacing ?? '',
    )}px`,
    opacity: defaultChart ? 0.5 : 1,
  };

  const theadStyles: CSSProperties = {
    backgroundColor: headerBgColor,
  };

  const evenTrStyles: CSSProperties = {
    backgroundColor: evenRowBgColor,
  };

  const oddTrStyles: CSSProperties = {
    backgroundColor: oddRowBgColor,
  };

  const tdStyles: CSSProperties = {
    outline: tableOutlineColor ? `1px solid ${tableOutlineColor}` : '',
  };

  return (
    <Stack
      sx={{ overflow: 'auto', userSelect: 'none', WebkitUserSelect: 'none' }}
      key={JSON.stringify(tableStyles) + `${rowHorizontalSpacing},${rowVerticalSpacing}`}>
      <table
        style={tableStyles}
        key={JSON.stringify(tableStyles) + `${rowHorizontalSpacing},${rowVerticalSpacing}`}>
        <thead style={theadStyles}>
          <tr>{headerRow?.map((header, i) => <th key={i}>{header}</th>)}</tr>
        </thead>
        <tbody>
          {chartData.slice(1).map((row, i) => (
            <tr key={i} style={i % 2 === 0 ? evenTrStyles : oddTrStyles}>
              {row.map((cell, i) => (
                <td style={tdStyles} key={i}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Stack>
  );
};
