import { Stack, Tooltip } from '@chakra-ui/react';

interface Props {
  renderedAttributeValue: string | number | null;
  alwaysShowSign?: boolean;
  attributeDescription?: string;
}

export const TextAttributeNode = ({
  alwaysShowSign,
  renderedAttributeValue,
  attributeDescription,
}: Props) => {
  const numberIsPositive = parseFloat(`${renderedAttributeValue}`) >= 0;

  return (
    <Tooltip label={attributeDescription} placement='right' openDelay={1000}>
      <Stack direction='row'>
        {alwaysShowSign && numberIsPositive && <span>+</span>}
        <span>{renderedAttributeValue}</span>
      </Stack>
    </Tooltip>
  );
};
