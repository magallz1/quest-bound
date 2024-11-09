import { Dice, DiceTheme } from '@/libs/compass-api';
import { Img } from '@/libs/compass-core-composites';
import { IconButton, Stack, Tooltip } from '@/libs/compass-core-ui';
import { ArrowLeft, ArrowRight, Casino } from '@mui/icons-material';
import { useEffect, useState } from 'react';

interface Props {
  availableDice: Dice[];
  previews: Record<string, string>;
  onAdd: (die: Dice) => void;
  theme: DiceTheme;
}

export const SelectDice = ({ previews, availableDice, onAdd, theme }: Props) => {
  const [page, setPage] = useState<number>(0);
  const diceThisPage = availableDice.slice(page * 6, page * 6 + 6);
  const finalPage = availableDice.length <= 6 || page === Math.floor(availableDice.length / 6);

  useEffect(() => {
    setPage(0);
  }, [theme]);

  const diceWithPreviews = diceThisPage.map((dice) => ({
    ...dice,
    preview: dice.id && previews[dice.id] ? previews[dice.id] : previews[dice.type],
  }));

  return (
    <Stack
      direction='row'
      spacing={1}
      alignItems='center'
      sx={{ overflowX: 'hidden', width: '100%' }}
      justifyContent='space-between'>
      <IconButton disabled={page === 0} onClick={() => setPage((prev) => Math.max(0, prev - 1))}>
        <ArrowLeft />
      </IconButton>

      {diceWithPreviews.map((dice, i) => (
        <Tooltip title={dice.label ?? dice.type} key={i}>
          <Img
            src={dice.preview}
            className='clickable'
            onClick={() => onAdd(dice)}
            placeholder={<Casino />}
          />
        </Tooltip>
      ))}

      <IconButton
        disabled={finalPage}
        onClick={() => setPage((prev) => Math.min(availableDice.length / 6, prev + 1))}>
        <ArrowRight />
      </IconButton>
    </Stack>
  );
};
