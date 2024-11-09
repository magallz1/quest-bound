import { SheetDetails } from '@/libs/compass-api';
import { Stack, Text, ToggleButton, ToggleButtonGroup } from '@/libs/compass-core-ui';
import { Grain, GridOn, VisibilityOff } from '@mui/icons-material';

interface GridStyleProps {
  details: SheetDetails;
  setDetails: (updates: SheetDetails) => void;
}

export const GridStyle = ({ setDetails, details }: GridStyleProps) => {
  return (
    <Stack spacing={1}>
      <Text>Grid Style</Text>
      <ToggleButtonGroup
        exclusive
        value={details.renderGrid ? [details.renderGrid] : []}
        onChange={(_, value) => setDetails({ renderGrid: value })}>
        <ToggleButton value='square'>
          <GridOn fontSize='small' />
        </ToggleButton>
        <ToggleButton value='dot'>
          <Grain fontSize='small' />
        </ToggleButton>
        <ToggleButton value={false}>
          <VisibilityOff fontSize='small' />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
};
