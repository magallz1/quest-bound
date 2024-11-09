import { useGetSheet, useUpdateSheet } from '@/libs/compass-api';

export const useSheetColors = (sheetId?: string) => {
  const { sheet } = useGetSheet(sheetId);
  const { updateSheet, loading } = useUpdateSheet();

  const details = JSON.parse(sheet?.details ?? '{}');

  const colors = (details.colors ?? []) as string[];

  const addColor = async (color: string) => {
    if (!sheetId) return;
    if (colors.includes(color)) return;

    updateSheet({
      input: {
        id: sheetId,
        details: JSON.stringify({
          ...details,
          colors: [...colors, color],
        }),
      },
    });
  };

  const removeColor = async (color: string) => {
    if (!sheetId) return;
    updateSheet({
      input: {
        id: sheetId,
        details: JSON.stringify({
          ...details,
          colors: colors.filter((c) => c !== color),
        }),
      },
    });
  };

  return {
    colors,
    addColor,
    removeColor,
    loading,
  };
};
