import { useGetSheet, useUpdateSheet } from '@/libs/compass-api';
import { useEditorStore } from '../editor-store';

export const useSheetColors = (sheetId: string) => {
  const { cacheOnly } = useEditorStore();
  const { sheet } = useGetSheet(sheetId);
  const { updateSheet, loading } = useUpdateSheet(cacheOnly);

  const details = JSON.parse(sheet?.details ?? '{}');

  const colors = (details.colors ?? []) as string[];

  const addColor = async (color: string) => {
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
