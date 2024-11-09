import { Chart } from '@/libs/compass-api';
import { IOType, Logic, LogicalValue, Operation, OperationType } from '@/libs/compass-planes';
import { getAllOperationsConnectedToInput } from './utils';

export function evaluateChartOperation(
  operation: Operation,
  logic: Logic,
  charts: Chart[],
  shouldUseTestValue = true,
): LogicalValue {
  if (!operation.chartRef) return 'Connect a chart';
  const filterConnection = operation.connections.find(
    (conn) => conn.sourceType === IOType.ChartFilter,
  );
  const chartRowOperation = logic.find((op) => op.id === filterConnection?.id);
  if (!chartRowOperation) return 'Connect a row comparison statement';

  const chart = charts.find((c) => c.id === operation.chartRef);
  const chartData = chart?.data ?? [[]];
  const selectFromColumnName = chartData[0].find((c) => c === operation.chartFilterColumnName);

  if (!selectFromColumnName) return 'Column not found in chart';
  const selectFromColumnIndex = chartData[0].indexOf(selectFromColumnName);

  if (!operation.chartValueColumnName) return 'Select a value column';
  const whereValueColumneName = operation.chartValueColumnName;
  const whereValueColumnIndex = chartData[0].indexOf(whereValueColumneName);

  const chartRowOperationConnections = getAllOperationsConnectedToInput(chartRowOperation, logic);

  // Consider the first op connected to the comparators input as the comparison value
  const chartRowConnection = chartRowOperationConnections.find((op) => op.id !== operation.id);

  if (!chartRowConnection) return '';

  let rowValues = chartData.slice(1).map((row) => row[whereValueColumnIndex]);

  let targetRowValues = chartData.slice(1).map((row) => row[selectFromColumnIndex]);

  if (operation.data?.reverse) {
    rowValues = rowValues.reverse();
    targetRowValues = targetRowValues.reverse();
  }

  const comparatorFn = (() => {
    switch (chartRowOperation.type) {
      case OperationType.NotEqual:
        return (a: any, b: any) => a != b;
      case OperationType.GreaterThan:
        return (a: any, b: any) => a > b;
      case OperationType.GreaterThanOrEqual:
        return (a: any, b: any) => a >= b;
      case OperationType.LessThan:
        return (a: any, b: any) => a < b;
      case OperationType.LessThanOrEqual:
        return (a: any, b: any) => a <= b;
      default:
        return (a: any, b: any) => a == b;
    }
  })();

  const chartIsFirst = operation.y < chartRowConnection.y;

  const chartRowConnectionValue = shouldUseTestValue
    ? chartRowConnection.data?.testValue ?? chartRowConnection.value
    : chartRowConnection.data?.parameterValue ?? chartRowConnection.value;

  for (let i = 0; i < rowValues.length; i++) {
    const [a, b] = chartIsFirst
      ? [rowValues[i], chartRowConnectionValue]
      : [chartRowConnectionValue, rowValues[i]];

    if (comparatorFn(a, b)) {
      return targetRowValues[i];
    }
  }

  return '';
}
