import { Attribute, AttributeType, ComponentData, UpdateSheetComponent } from '@/libs/compass-api';
import { AttributeLookup } from '@/libs/compass-core-composites';
import { IconButton, Tooltip } from '@/libs/compass-core-ui';
import { Popover, PopoverContent, PopoverTrigger, Stack, Text } from '@chakra-ui/react';
import { AccountTree, AdsClick } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';

interface Props {
  data: ComponentData;
  onChange: (update: Partial<UpdateSheetComponent>) => void;
}

export const AssignAction = ({ data, onChange }: Props) => {
  const actionId = data.actionId;

  const [searchParams, setSearchParams] = useSearchParams();

  const handleAssign = (attribute: Attribute | null) => {
    onChange({
      data: JSON.stringify({
        actionId: attribute?.id ?? null,
      }),
    });
  };

  const openAttributeLogic = () => {
    if (!actionId) return;
    searchParams.set('attributeId', actionId);
    setSearchParams(searchParams);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Tooltip title='Assign Action'>
          <IconButton color={actionId ? 'secondary' : 'inherit'}>
            <AdsClick fontSize='small' />
          </IconButton>
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent>
        <Stack padding={2} spacing={1}>
          <Text>Assign Action</Text>
          <Stack direction='row' alignItems='center'>
            <AttributeLookup
              onSelect={handleAssign}
              attributeId={actionId ?? undefined}
              filterByType={AttributeType.ACTION}
            />
            <Tooltip title='Edit Logic'>
              <IconButton onClick={openAttributeLogic} disabled={!actionId}>
                <AccountTree />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </PopoverContent>
    </Popover>
  );
};
