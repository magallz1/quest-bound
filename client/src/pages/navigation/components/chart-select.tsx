import { useCharts } from '@/libs/compass-api';
import { Loader, Stack, Text } from '@/libs/compass-core-ui';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

interface Props {
  filterValue?: string;
}

export const ChartSelect = ({ filterValue }: Props) => {
  const { charts, loading } = useCharts();
  const { rulesetId, characterId } = useParams();

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const filteredCharts = charts
    .filter((chart) => chart.title.toLowerCase().includes(filterValue?.toLowerCase() ?? ''))
    .sort((a, b) => a.title.localeCompare(b.title));

  const handleSelect = (id: string) => {
    navigate(`rulesets/${rulesetId}/characters/${characterId}/charts?chartId=${id}`);
  };

  return (
    <Stack
      height='100%'
      width='100%'
      pl={2}
      pr={2}
      sx={{ maxWidth: 240, overflowY: 'auto', maxHeight: '50vh' }}>
      {loading && <Loader color='info' />}
      {filteredCharts.map((chart) => (
        <Text
          className='clickable'
          key={chart.id}
          sx={{
            fontSize: '0.9rem',
            color: chart.id === searchParams.get('chartId') ? 'secondary.main' : 'inherit',
          }}
          onClick={() => handleSelect(chart.id)}>
          {chart.title}
        </Text>
      ))}
    </Stack>
  );
};
