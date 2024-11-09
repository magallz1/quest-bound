import { useDeviceSize } from '@/libs/compass-core-ui';
import { Popover, PopoverContent, PopoverTrigger, Stack, Text } from '@chakra-ui/react';

interface Props {
  direction: 'row' | 'column';
}

export const HeaderText = ({ direction }: Props) => {
  const { mobile } = useDeviceSize();

  return (
    <>
      <Stack direction={direction} spacing={direction === 'row' ? 2 : 0}>
        {!mobile && <Text sx={{ opacity: 0.8, fontFamily: 'CygnitoMonoPro' }}>Quest Bound</Text>}

        <Popover>
          <PopoverTrigger>
            <Text
              role='button'
              sx={{
                color: 'info',
                textDecoration: 'underline',
              }}>
              Leaving the Web
            </Text>
          </PopoverTrigger>
          <PopoverContent sx={{ width: '350px' }}>
            <Stack spacing={1} padding={2}>
              <Text>Quest Bound's web servers will shut down at the end of 2024.</Text>
              <Text>
                Subscribe to email updates in settings to be informed when Quest Bound's source code
                is available.
              </Text>
            </Stack>
          </PopoverContent>
        </Popover>
      </Stack>
    </>
  );
};
