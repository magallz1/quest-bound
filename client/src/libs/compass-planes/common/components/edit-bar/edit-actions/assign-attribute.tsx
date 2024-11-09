import {
  Attribute,
  AttributeType,
  CheckboxComponentData,
  GraphComponentData,
  InputComponentData,
  TextComponentData,
  UpdateSheetComponent,
  useAttribute,
} from '@/libs/compass-api';
import { AttributeLookup } from '@/libs/compass-core-composites';
import { IconButton, Progress, Tooltip } from '@/libs/compass-core-ui';
import { Popover, PopoverContent, PopoverTrigger, Stack, Switch, Text } from '@chakra-ui/react';
import { AccountTree, Calculate } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';

interface Props {
  data: InputComponentData | CheckboxComponentData | TextComponentData | GraphComponentData;
  onChange: (update: Partial<UpdateSheetComponent>) => void;
  showSignOption?: boolean;
  filterByType?: AttributeType;
  filterOutByType?: AttributeType[];
}

export const AssignAttribute = ({
  data,
  onChange,
  showSignOption = false,
  filterByType,
  filterOutByType = [],
}: Props) => {
  const attributeId = data.attributeId;

  const { attribute, loading } = useAttribute(attributeId ?? undefined);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleAssign = (attribute: Attribute | null) => {
    onChange({
      data: JSON.stringify({
        attributeId: attribute?.id ?? null,
      }),
    });
  };

  const handleSignChange = (alwaysShowSign: boolean) => {
    onChange({
      data: JSON.stringify({
        alwaysShowSign,
      }),
    });
  };

  const openAttributeLogic = () => {
    if (!attribute) return;
    searchParams.set('attributeId', attribute.id);
    setSearchParams(searchParams);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Tooltip title='Assign Attribute'>
            <IconButton color={attributeId ? 'secondary' : 'inherit'}>
              <Calculate fontSize='small' />
            </IconButton>
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent>
          <Stack padding={2} spacing={4}>
            <Text>Assign Attribute</Text>
            <Stack direction='row' alignItems='center'>
              <AttributeLookup
                onSelect={handleAssign}
                attributeId={attributeId ?? undefined}
                filterByType={filterByType}
                filterOutByType={filterOutByType}
              />
              <Tooltip title='Edit Logic'>
                <IconButton disabled={!attribute} onClick={openAttributeLogic}>
                  <AccountTree fontSize='small' />
                </IconButton>
              </Tooltip>
            </Stack>
            {attribute?.type === AttributeType.NUMBER &&
              showSignOption &&
              (loading ? (
                <Progress color='info' />
              ) : (
                <Switch
                  isChecked={data.alwaysShowSign ?? false}
                  onChange={(e) => handleSignChange(e.target.checked)}>
                  Always show sign
                </Switch>
              ))}
          </Stack>
        </PopoverContent>
      </Popover>
    </>
  );
};
