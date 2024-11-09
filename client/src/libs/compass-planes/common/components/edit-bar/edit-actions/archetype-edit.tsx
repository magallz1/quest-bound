import { ArchetypeComponentData, SheetComponent } from '@/libs/compass-api';
import { IconButton, Tooltip } from '@/libs/compass-core-ui';
import { Edit } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';

export const ArchetypeEdit = ({ component }: { component: SheetComponent }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const data = JSON.parse(component.data) as ArchetypeComponentData;

  const handleOpenPanel = () => {
    if (data.archetypeId) {
      searchParams.set('archetype', data.archetypeId);
      setSearchParams(searchParams);
    }
  };

  return (
    <>
      <Tooltip title='Edit Archetype'>
        <IconButton onClick={handleOpenPanel}>
          <Edit fontSize='small' />
        </IconButton>
      </Tooltip>
    </>
  );
};
