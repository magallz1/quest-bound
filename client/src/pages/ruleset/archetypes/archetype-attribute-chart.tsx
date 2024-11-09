import { Attribute, useArchetypes } from '@/libs/compass-api';
import { Grid } from '@/libs/compass-core-composites';
import { IconButton } from '@/libs/compass-core-ui';
import { Delete } from '@mui/icons-material';

interface ArchetypeAttributeChartProps {
  attributeData: Attribute[];
  archetypeId: string | null;
  onRemove: (attributeId: string) => void;
  onEdit: (attribute: Attribute, varDefault: string | number | boolean) => void;
  removing: boolean;
}

export const ArchetypeAttributeChart = ({
  archetypeId,
  attributeData,
  onRemove,
  onEdit,
  removing,
}: ArchetypeAttributeChartProps) => {
  const { archetypes } = useArchetypes();

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      filter: true,
    },
    {
      field: 'defaultValue',
      headerName: 'Default Value',
      editable: true,
    },
    {
      field: 'parent',
      headerName: 'Inherited From',
      filter: true,
    },
    {
      field: 'controls',
      headerName: '',
      cellRenderer: (params: { data: Attribute }) => {
        return (
          <IconButton
            onClick={() => onRemove(params.data.id)}
            title='Remove variation'
            disabled={archetypeId !== params.data.sourceId || removing}>
            <Delete fontSize='small' />
          </IconButton>
        );
      },
    },
  ];

  const attributesWithParent = attributeData
    .map((a) => {
      const sourceArchetype = archetypes.find((i) => i.id === a.sourceId);

      return {
        ...a,
        parent: sourceArchetype?.id === archetypeId ? '-' : sourceArchetype?.title ?? '-',
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleChange = (update: Attribute) => {
    onEdit(update, update.defaultValue ?? '');
  };

  return (
    <Grid colDefs={columns} rowData={attributesWithParent} onCellValueChanged={handleChange} />
  );
};
