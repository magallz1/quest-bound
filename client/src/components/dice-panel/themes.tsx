import { DiceTheme } from '@/libs/compass-api';
import { Img } from '@/libs/compass-core-composites';
import { IconButton, Progress, Stack, Text, Tooltip } from '@/libs/compass-core-ui';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { useState } from 'react';

interface Props {
  setTheme: (theme: DiceTheme) => void;
  getThemes: () => Promise<any>;
}

export const DiceThemes = ({ setTheme, getThemes }: Props) => {
  const [themes, setThemes] = useState<DiceTheme[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [themesOpen, setThemesOpen] = useState<boolean>(false);

  const themesThisPage = themes.slice(page * 6, page * 6 + 6);
  const finalPage = page === Math.floor(themes.length / 6);

  const handleGetThemes = async () => {
    setLoading(true);
    const res = await getThemes();
    setThemes(
      (res.data ?? []).map((theme: any) => ({
        label: theme.name,
        previews: theme.preview,
        id: theme.id,
        availableDice: theme.available_dice ?? [],
        bannerPreview:
          theme.preview.preview ?? theme.preview.d20 ?? Object.values(theme.preview)[0] ?? '',
      })),
    );
    setLoading(false);
  };

  return (
    <Stack width='100%' alignItems='center' spacing={2}>
      <Text
        className='clickable'
        sx={{ textDecoration: 'underline' }}
        onClick={() => {
          setThemesOpen((prev) => !prev);
          handleGetThemes();
        }}>
        {themesOpen ? 'Close Themes' : 'Select Theme'}
      </Text>

      {themesOpen && (
        <Stack
          direction='row'
          spacing={1}
          alignItems='center'
          sx={{ overflowX: 'hidden', width: 400 }}
          justifyContent='space-between'>
          <IconButton
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}>
            <ArrowLeft />
          </IconButton>

          {loading && (
            <Stack width='100%' height={10}>
              <Progress color='info' />
            </Stack>
          )}

          {themesThisPage.map((theme) => (
            <Tooltip key={theme.id} title={<Text>{theme.label}</Text>}>
              <Img
                className='clickable'
                onClick={() => {
                  setTheme(theme);
                  setThemesOpen(false);
                }}
                src={theme.bannerPreview}
                style={{ height: 40, width: 40 }}
              />
            </Tooltip>
          ))}

          <IconButton
            disabled={finalPage}
            onClick={() => setPage((prev) => Math.min(themes.length / 6, prev + 1))}>
            <ArrowRight />
          </IconButton>
        </Stack>
      )}
    </Stack>
  );
};
