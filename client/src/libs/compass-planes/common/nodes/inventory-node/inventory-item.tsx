import {
  AttributeContext,
  AttributeType,
  ContextualItem,
  ContextualItemProperty,
  UpdateCharacterItem,
} from '@/libs/compass-api';
import { IconButton } from '@/libs/compass-core-ui';
import {
  Button,
  Checkbox,
  Editable,
  EditableInput,
  EditablePreview,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  Textarea,
  Tooltip,
} from '@chakra-ui/react';
import { Delete } from '@mui/icons-material';
import { useContext } from 'react';

interface Props {
  item: ContextualItem;
  onDelete?: () => void;
}

export const InventoryItem = ({ item, onDelete }: Props) => {
  const { updateItem, removeItem, triggerItemAbility } = useContext(AttributeContext);

  const onChange = ({ id, propertyId, value, name, description }: UpdateCharacterItem) => {
    updateItem({
      id,
      propertyId,
      value,
      name,
      description,
    });
  };

  const getStackWeight = (item: ContextualItem) => {
    const qty = (item.properties.find((property) => property.id === 'quantity')?.value ??
      1) as number;
    return qty * item.data.weight;
  };

  return (
    <Stack spacing={4} onClick={(e) => e.stopPropagation()}>
      <Stack direction='row' width='100%' justifyContent='space-between'>
        <Editable
          defaultValue={item.name}
          onSubmit={(name) => onChange({ id: item.instanceId, name })}>
          <EditablePreview />
          <EditableInput />
        </Editable>

        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            removeItem(item.instanceId);
            onDelete?.();
          }}>
          <Delete />
        </IconButton>
      </Stack>
      <Text fontSize='0.9rem' fontStyle='italic'>{`Stack weight: ${getStackWeight(item)}`}</Text>
      <Textarea
        value={item.description}
        onChange={(e) => onChange({ id: item.instanceId, description: e.target.value })}
      />
      <Stack spacing={4}>
        {item.properties.map((property) => (
          <RenderPropertyControl
            key={property.id}
            property={property}
            onChange={(props) => onChange({ id: item.instanceId, ...props })}
            max={property.id === 'quantity' ? item.data.maxQuantity : undefined}
            min={property.id === 'quantity' ? 1 : undefined}
          />
        ))}
      </Stack>
      <Stack direction='row' spacing={3} flexWrap='wrap'>
        {item.abilities.map((ability) => (
          <Tooltip label={ability.description} key={ability.id}>
            <Button
              sx={{ maxWidth: '200px' }}
              onClick={(e) => {
                e.stopPropagation();
                triggerItemAbility(item.instanceId, ability.id);
              }}>
              {ability.name}
            </Button>
          </Tooltip>
        ))}
      </Stack>
    </Stack>
  );
};

function RenderPropertyControl({
  property,
  onChange,
  max,
  min,
}: {
  property: ContextualItemProperty;
  onChange: (props: Omit<UpdateCharacterItem, 'id'>) => void;
  max?: number;
  min?: number;
}) {
  if (property.type === AttributeType.BOOLEAN) {
    return (
      <Checkbox
        isChecked={property.value === 'true'}
        onChange={(e) => onChange({ propertyId: property.id, value: e.target.checked.toString() })}>
        {property.name}
      </Checkbox>
    );
  }
  if (property.type === AttributeType.NUMBER) {
    return (
      <Stack>
        <Text>{property.name}</Text>
        <NumberInput
          value={`${property.value}`}
          max={max}
          min={min}
          onChange={(value) => onChange({ propertyId: property.id, value })}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Stack>
    );
  }
  return (
    <Stack>
      <Text>{property.name}</Text>
      <Input
        value={`${property.value}`}
        onChange={(e) => {
          e.stopPropagation();
          onChange({ propertyId: property.id, value: e.target.value });
        }}
      />
    </Stack>
  );
}
