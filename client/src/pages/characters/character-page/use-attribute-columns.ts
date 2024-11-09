import { AttributeType, ContextualAttribute } from '@/libs/compass-api';

export const useAttributeColumns = (attributes: ContextualAttribute[], columns: number) => {
  const firstColumn =
    columns === 1
      ? attributes
      : columns === 2
        ? attributes.filter((a) => a.type !== AttributeType.BOOLEAN)
        : attributes.filter((a) => a.type === AttributeType.TEXT);

  const secondColumn =
    columns === 1
      ? []
      : columns === 2
        ? attributes.filter((a) => a.type === AttributeType.BOOLEAN)
        : attributes.filter((a) => a.type === AttributeType.NUMBER);

  const thirdColumn =
    columns === 3 ? attributes.filter((a) => a.type === AttributeType.BOOLEAN) : [];

  return {
    firstColumn,
    secondColumn,
    thirdColumn,
  };
};
