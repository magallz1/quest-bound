import { AttributeType, ContextualAttribute } from '@/libs/compass-api';
import {
  IconButton,
  Input,
  InputProps,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { Refresh } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';

interface Props {
  renderedAttributeValue: number | string | null;
  handleChange: (id: string, value: string) => void;
  ignoreLabel?: boolean;
  attribute: ContextualAttribute;
  attributeDescription?: string | null;
  reenableLogic: () => void;
  loading: boolean;
  inputProps?: InputProps;
  id: string;
  hideWheel?: boolean;
  style?: React.CSSProperties;
  viewMode?: boolean;
}

export const InputAttributeNode = ({
  id,
  renderedAttributeValue,
  handleChange,
  ignoreLabel,
  attribute,
  attributeDescription,
  reenableLogic,
  loading,
  hideWheel,
  style,
  viewMode,
}: Props) => {
  const restraints = (attribute.restraints ?? []).filter(Boolean);

  return (
    <Stack>
      <Tooltip
        label={!!attributeDescription && viewMode ? attributeDescription : null}
        placement='right'
        openDelay={1000}>
        <Stack>
          {!ignoreLabel && <Text>{attribute.name}</Text>}

          <Stack direction='row' spacing={2}>
            {restraints.length > 0 ? (
              <Select
                value={renderedAttributeValue as string}
                placeholder={attribute.name}
                sx={style}
                onChange={(e) => handleChange(attribute.id, e.target.value as string)}>
                {restraints.map((restraint: string, i: number) => (
                  <option key={i} value={restraint}>
                    {restraint}
                  </option>
                ))}
              </Select>
            ) : attribute.type === AttributeType.NUMBER && !hideWheel ? (
              <NumberInput
                value={`${renderedAttributeValue}`}
                sx={style}
                onChange={(value) => handleChange(attribute.id, value)}>
                <NumberInputField placeholder={attribute.name} sx={style} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            ) : (
              <Input
                value={`${renderedAttributeValue}`}
                type={attribute.type === AttributeType.NUMBER ? 'number' : 'text'}
                sx={style}
                onChange={(e) => handleChange(attribute.id, e.target.value)}
                placeholder={attribute.name}
              />
            )}
            {attribute.logicDisabled && viewMode && (
              <StartAdornment
                logicDisabled={attribute.logicDisabled ?? false}
                reenableLogic={reenableLogic}
              />
            )}
          </Stack>
        </Stack>
      </Tooltip>
    </Stack>
  );
};

const StartAdornment = ({
  logicDisabled,
  reenableLogic,
}: {
  logicDisabled: boolean;
  reenableLogic: () => void;
}) => {
  const [params] = useSearchParams();
  const isSimpleSheet = params.get('selected') === 'simple-sheet';

  if (logicDisabled) {
    return (
      <Tooltip
        placement='top'
        label='This attribute has been manually changed. Click to re-enable its automated logic'>
        <IconButton
          aria-label='Reenable logic'
          onClick={reenableLogic}
          variant='ghost'
          sx={{
            position: isSimpleSheet ? 'relative' : 'absolute',
            zIndex: 1000,
            left: isSimpleSheet ? '0px' : '-40px',
          }}>
          <Refresh fontSize='small' />
        </IconButton>
      </Tooltip>
    );
  }
  return null;
};
