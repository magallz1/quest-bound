import { UpdateSheetComponent } from '@/libs/compass-api';
import { IconButton, Stack, Text, Tooltip } from '@/libs/compass-core-ui';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import { BorderStyle, ChevronRight, Circle, CropFree, Square } from '@mui/icons-material';
import { IconColorPicker } from '../edit-components/icon-color-picker';

interface BorderEditProps {
  onChange: (update: Partial<UpdateSheetComponent>) => void;
  allCommonStyles: any;
  disabled?: boolean;
  polygon?: boolean;
}

export const BorderEdit = ({
  onChange,
  disabled,
  allCommonStyles,
  polygon = false,
}: BorderEditProps) => {
  const cornersDisabled = allCommonStyles.borderRadius === '50%' || disabled || polygon;
  const allCornersAreEqual = !!(
    allCommonStyles.borderTopLeftRadius === allCommonStyles.borderTopRightRadius &&
    allCommonStyles.borderTopLeftRadius === allCommonStyles.borderBottomLeftRadius &&
    allCommonStyles.borderTopLeftRadius === allCommonStyles.borderBottomRightRadius &&
    allCommonStyles.borderBottomRightRadius === allCommonStyles.borderAllRadius
  );

  const handleChange = (update: any) => {
    onChange({
      style: JSON.stringify(update),
    });
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Tooltip title={disabled ? '' : 'Border'}>
            <IconButton disabled={disabled}>
              <BorderStyle />
            </IconButton>
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent style={{ width: 200 }}>
          <Stack spacing={1} padding={2}>
            <Text sx={{ width: '100%', textAlign: 'center' }} variant='subtitle2'>
              Border
            </Text>

            <Stack direction='row' width='100%' justifyContent='space-between'>
              <IconColorPicker
                tooltipPlacement='top'
                disabled={disabled}
                useAlpha
                type='draw'
                color={allCommonStyles.outlineColor ?? allCommonStyles.backgroundColor ?? '#FFF'}
                onChange={(outlineColor) => handleChange({ outlineColor })}
              />

              <Tooltip
                placement='top'
                title={disabled ? '' : allCommonStyles.borderRadius === '50%' ? 'Square' : 'Round'}>
                <IconButton
                  onClick={() =>
                    handleChange({
                      borderRadius: allCommonStyles.borderRadius === '50%' ? '0%' : '50%',
                    })
                  }
                  disabled={disabled || polygon}>
                  {allCommonStyles.borderRadius === '50%' ? (
                    <Square fontSize='small' />
                  ) : (
                    <Circle fontSize='small' />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>

            <Stack direction='row' alignItems='center' justifyContent='space-between' width='100%'>
              <Text variant='subtitle2'>Width</Text>
              <NumberInput
                sx={{ width: 70 }}
                min={0}
                value={allCommonStyles.outlineWidth ?? 0}
                onChange={(outlineWidth) => handleChange({ outlineWidth })}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Stack>

            <Stack direction='row' alignItems='center' justifyContent='space-between' width='100%'>
              <Text variant='subtitle2'>Offset</Text>
              <NumberInput
                sx={{ width: 70 }}
                value={allCommonStyles.outlineOffset ?? 0}
                onChange={(outlineOffset) => handleChange({ outlineOffset })}>
                <NumberInputField disabled={polygon} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Stack>

            <Stack direction='row' alignItems='center' justifyContent='space-between' width='100%'>
              <CropFree fontSize='small' color={cornersDisabled ? 'disabled' : 'inherit'} />
              <NumberInput
                sx={{ width: 70, opacity: allCornersAreEqual ? 1 : 0.5 }}
                value={allCommonStyles.borderAllRadius ?? 0}
                min={0}
                onChange={(value) =>
                  handleChange({
                    borderTopLeftRadius: value,
                    borderTopRightRadius: value,
                    borderBottomLeftRadius: value,
                    borderBottomRightRadius: value,
                    borderAllRadius: value,
                  })
                }>
                <NumberInputField disabled={cornersDisabled} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Stack>

            <Stack direction='row' alignItems='center' justifyContent='space-between' width='100%'>
              <ChevronRight
                fontSize='small'
                sx={{ transform: 'rotate(-135deg)' }}
                color={cornersDisabled ? 'disabled' : 'inherit'}
              />
              <NumberInput
                sx={{ width: 70 }}
                min={0}
                value={allCommonStyles.borderTopLeftRadius ?? 0}
                onChange={(borderTopLeftRadius) => handleChange({ borderTopLeftRadius })}>
                <NumberInputField disabled={cornersDisabled} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Stack>

            <Stack direction='row' alignItems='center' justifyContent='space-between' width='100%'>
              <ChevronRight
                fontSize='small'
                sx={{ transform: 'rotate(-45deg)' }}
                color={cornersDisabled ? 'disabled' : 'inherit'}
              />
              <NumberInput
                sx={{ width: 70 }}
                min={0}
                value={allCommonStyles.borderTopRightRadius ?? 0}
                onChange={(borderTopRightRadius) => handleChange({ borderTopRightRadius })}>
                <NumberInputField disabled={cornersDisabled} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Stack>

            <Stack direction='row' alignItems='center' justifyContent='space-between' width='100%'>
              <ChevronRight
                fontSize='small'
                sx={{ transform: 'rotate(135deg)' }}
                color={cornersDisabled ? 'disabled' : 'inherit'}
              />
              <NumberInput
                sx={{ width: 70 }}
                min={0}
                value={allCommonStyles.borderBottomLeftRadius ?? 0}
                onChange={(borderBottomLeftRadius) => handleChange({ borderBottomLeftRadius })}>
                <NumberInputField disabled={cornersDisabled} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Stack>

            <Stack direction='row' alignItems='center' justifyContent='space-between' width='100%'>
              <ChevronRight
                fontSize='small'
                sx={{ transform: 'rotate(45deg)' }}
                color={cornersDisabled ? 'disabled' : 'inherit'}
              />
              <NumberInput
                sx={{ width: 70 }}
                min={0}
                value={allCommonStyles.borderBottomRightRadius ?? 0}
                onChange={(borderBottomRightRadius) => handleChange({ borderBottomRightRadius })}>
                <NumberInputField disabled={cornersDisabled} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Stack>
          </Stack>
        </PopoverContent>
      </Popover>
    </>
  );
};
