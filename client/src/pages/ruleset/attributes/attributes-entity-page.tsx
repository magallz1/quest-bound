import { useQuickCreate } from '@/hooks';
import {
  AttributeType,
  UpdateAttribute,
  useAttributes,
  useUpdateAttribute,
} from '@/libs/compass-api';
import { Button, Input, Stack, Text } from '@chakra-ui/react';
import { Add } from '@mui/icons-material';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AttributeChart } from './attribute-chart';
import { ImportExportAttributes } from './components/import-export-attributes';
import { AttributeLogicEditor } from './logic-editor';

interface Props {
  type?: AttributeType;
}

export const AttributesEntityPage = ({ type }: Props) => {
  const { setQuickCreatePage } = useQuickCreate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [copiedAttributeTitle, setCopiedAttributeTitle] = useState<string | null>(null);

  const { attributes: _attributes, loading } = useAttributes();
  const { attributes: items, loading: itemsLoading } = useAttributes(
    type !== AttributeType.ITEM,
    AttributeType.ITEM,
  );

  const attributes = type === AttributeType.ITEM ? items : _attributes;

  const { updateAttribute } = useUpdateAttribute();

  const setFilterValue = (value: string) => {
    if (!value) {
      searchParams.delete('filter');
      setSearchParams(searchParams);
      return;
    }
    searchParams.set('filter', value);
    setSearchParams(searchParams);
  };

  const filterValue = searchParams.get('filter') ?? '';

  const filteredAttributes = attributes.filter((a) =>
    a.name.toLowerCase().includes(filterValue.toLowerCase()),
  );

  const handleUpdate = async (input: Omit<UpdateAttribute, 'rulesetId'>) => {
    const inputType = input.type ? (input.type.toUpperCase() as AttributeType) : undefined;

    updateAttribute({
      id: input.id,
      name: input.name,
      category: input.category,
      defaultValue:
        input.defaultValue === null && inputType === AttributeType.TEXT ? '' : input.defaultValue,
      type: inputType,
      description: input.description,
    });
  };

  return (
    <>
      <Stack
        spacing={4}
        sx={{
          flexGrow: 1,
        }}>
        <Stack direction='row' justifyContent='space-between' width='100%'>
          <Stack direction='row' spacing={2} alignItems='center' width='70%'>
            <Button
              onClick={() => setQuickCreatePage(type === AttributeType.ITEM ? 'item' : 'attribute')}
              rightIcon={<Add fontSize='small' />}>
              {`Create ${type === AttributeType.ITEM ? 'Item' : 'Attribute'}`}
            </Button>
            <Input
              maxWidth={250}
              placeholder='Filter by name'
              onChange={(e) => setFilterValue(e.target.value)}
              value={filterValue}
            />
            {copiedAttributeTitle && (
              <Text
                fontSize='0.9rem'
                fontStyle='italic'>{`Copied logic of ${copiedAttributeTitle}`}</Text>
            )}
          </Stack>
          <ImportExportAttributes type={type} />
        </Stack>
        <AttributeChart
          editable
          attributes={filteredAttributes}
          isItem={type === AttributeType.ITEM}
          loading={loading || itemsLoading}
          setCopiedAttributeTitle={setCopiedAttributeTitle}
          handleUpdate={handleUpdate}
        />
      </Stack>
      <AttributeLogicEditor isItem={type === AttributeType.ITEM} />
    </>
  );
};
