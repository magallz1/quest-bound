import { AttributeType, useAttributes, useCharts } from '@/libs/compass-api';
import { NodeOption, nodeOptions } from '../node-data';
import { OperationType } from '../types';

export const useUserContextContent = (filterValue: string) => {
  const { attributes } = useAttributes();
  const { charts } = useCharts();

  const actions = attributes.filter((a) => a.type === AttributeType.ACTION);
  const nonActions = attributes.filter((a) => a.type !== AttributeType.ACTION);

  const nodeOptionsWithUserContent: NodeOption[] = [
    ...nodeOptions,
    ...nonActions.map((attribute) => ({
      category: 'Attributes',
      name: attribute.name,
      type: OperationType.Attribute,
      id: attribute.id,
      description: attribute.description ?? '',
    })),
    ...actions.map((attribute) => ({
      category: 'Actions',
      name: attribute.name,
      type: OperationType.Action,
      id: attribute.id,
      description: attribute.description ?? '',
    })),
    ...charts.map((chart) => ({
      category: 'Charts',
      name: chart.title,
      type: OperationType.ChartRef,
      id: chart.id,
    })),
  ];

  const filteredOptions = nodeOptionsWithUserContent.filter(
    (option) =>
      option.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      option.category.toLowerCase().includes(filterValue.toLowerCase()),
  );

  const categoryMap = new Map<string, NodeOption[]>();

  for (const option of filteredOptions) {
    if (!categoryMap.has(option.category)) {
      categoryMap.set(option.category, []);
    }
    categoryMap.get(option.category)?.push(option);
  }

  return categoryMap;
};
