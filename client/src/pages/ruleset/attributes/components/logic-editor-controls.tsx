import { Attribute, useUpdateAttribute } from '@/libs/compass-api';
import { Button, Confirm, Stack, Text } from '@/libs/compass-core-ui';
import { LogicalValue } from '@/libs/compass-planes';
import { useState } from 'react';

interface LogicEditorControlsProps {
  attribute?: Attribute | null;
  result?: LogicalValue;
  setForcedLoading: (loading: boolean) => void;
}

export const LogicEditorControls = ({
  attribute,
  result,
  setForcedLoading,
}: LogicEditorControlsProps) => {
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  const { updateAttribute } = useUpdateAttribute();

  const resetAttributeLogic = async () => {
    if (!attribute) return;
    setForcedLoading(true);

    await updateAttribute({
      id: attribute.id,
      logic: JSON.stringify([]),
    });

    setConfirmReset(false);
    setForcedLoading(false);
  };

  return (
    <>
      <Stack direction='row' spacing={4} alignItems='center'>
        <Text sx={{ userSelect: 'none' }}>{`Derived Value: ${result ?? ''}`}</Text>

        <Button
          variant='text'
          onClick={() => {
            setConfirmReset(true);
          }}>
          Reset
        </Button>
      </Stack>
      <Confirm
        title='Reset Attribute Logic?'
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={resetAttributeLogic}>
        <Text>This cannot be undone</Text>
      </Confirm>
    </>
  );
};
