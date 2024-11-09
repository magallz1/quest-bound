import {
  AttributeType,
  useAttribute,
  useCreateAttribute,
  useUpdateAttribute,
} from '@/libs/compass-api';
import { Loader } from '@/libs/compass-core-ui';
import { useNotifications } from '@/stores/notification-store';
import {
  Button,
  IconButton,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  Stack,
  Text,
  Textarea,
  Tooltip,
} from '@chakra-ui/react';
import { Delete } from '@mui/icons-material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { SetAttributeRestraints } from './set-attribute-restraints';

type FormValues = {
  name: string;
  type: AttributeType;
  description: string;
  defaultValue: string;
  restraints: string[];
  category?: string;
};

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  type: yup.string().required('Type is required'),
});

const getDefaultValue = (type: AttributeType) => {
  switch (type) {
    case AttributeType.NUMBER:
      return '0';
    case AttributeType.BOOLEAN:
      return 'false';
    default:
      return '';
  }
};

interface Props {
  attributeId?: string;
  onComplete?: () => void;
}

export const AttributeForm = ({ attributeId, onComplete }: Props) => {
  const { rulesetId } = useParams();
  const { addNotification } = useNotifications();

  const { attribute, loading: attributeLoading } = useAttribute(attributeId);
  const { createAttribute, loading: createLoading } = useCreateAttribute();
  const { updateAttribute, loading: updateLoading } = useUpdateAttribute();
  const [restraintChartOpen, setRestraintChartOpen] = useState<boolean>(false);
  const [restraint, setRestraint] = useState<string>('');

  const [searchParams] = useSearchParams();
  const activeCategory =
    searchParams.get('category') === 'All' ? '' : searchParams.get('category') ?? '';

  const initialName = searchParams.get('name') ?? attribute?.name ?? '';

  const loading = createLoading || updateLoading;

  const handleSubmit = async (values: FormValues) => {
    if (!rulesetId) return;

    const input = {
      rulesetId,
      ...values,
    };

    if (!!attribute) {
      await updateAttribute({
        id: attribute.id,
        name: values.name ?? undefined,
        type: values.type ?? undefined,
        description: values.description ?? undefined,
        defaultValue: values.defaultValue ? `${values.defaultValue}` : getDefaultValue(values.type),
        category: values.category ?? undefined,
        restraints: values.restraints.length > 0 ? values.restraints : [],
      });
    } else {
      await createAttribute({
        ...input,
        defaultValue: input.defaultValue
          ? `${input.defaultValue}`
          : input.type === AttributeType.NUMBER
            ? '0'
            : '',
      });
    }

    handleComplete();
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      name: initialName,
      type: AttributeType.NUMBER,
      defaultValue: getDefaultValue(AttributeType.NUMBER),
      description: '',
      restraints: [],
      category: activeCategory,
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (attribute) {
      formik.setValues({
        name: attribute.name,
        defaultValue: `${attribute.defaultValue}`,
        restraints: attribute.restraints ?? [],
        type: attribute.type,
        description: attribute.description ?? '',
        category: attribute.category ?? '',
      });
    } else if (initialName) {
      formik.setFieldValue('name', initialName);
    }
  }, [attribute, initialName]);

  useEffect(() => {
    if (!attribute) {
      formik.setFieldValue('defaultValue', getDefaultValue(formik.values.type));
    }
  }, [formik.values.type, attribute]);

  const handleComplete = () => {
    addNotification({
      message: attributeId ? 'Attribute Updated' : 'Attribute Created',
      status: 'success',
    });

    const currentType = formik.values.type;

    formik.resetForm();

    formik.setValues({
      name: '',
      type: currentType,
      defaultValue: getDefaultValue(currentType),
      restraints: [],
      description: '',
      category: '',
    });

    setRestraint('');

    onComplete?.();
  };

  if (attributeLoading) {
    return (
      <Stack height='100%' width='100%' justifyContent='center' alignItems='center'>
        <Loader color='info' />
      </Stack>
    );
  }

  return (
    <>
      <Stack spacing={6} width='100%'>
        <Stack direction='row' spacing={4} flexWrap='wrap'>
          <Button isDisabled={!formik.values.name} isLoading={loading} onClick={formik.submitForm}>
            {!!attribute ? 'Update' : 'Create'}
          </Button>
        </Stack>
        <Input
          placeholder='Title'
          value={formik.values.name}
          onChange={(e) => formik.setFieldValue('name', e.target.value)}
        />
        <Select
          value={formik.values.type}
          onChange={(e) => formik.setFieldValue('type', e.target.value)}>
          <option value={AttributeType.NUMBER}>Number</option>
          <option value={AttributeType.TEXT}>Text</option>
          <option value={AttributeType.BOOLEAN}>Boolean</option>
          <option value={AttributeType.ACTION}>Action</option>
        </Select>
        <Input
          placeholder='Category'
          value={formik.values.category}
          onChange={(e) => formik.setFieldValue('category', e.target.value)}
        />

        {formik.values.type === AttributeType.BOOLEAN ? (
          <Select
            id='defaultValue'
            value={formik.values.defaultValue}
            onChange={(e) => formik.setFieldValue('defaultValue', e.target.value)}>
            <option value='true'>True</option>
            <option value='false'>False</option>
          </Select>
        ) : (
          <Input
            placeholder='Default Value'
            value={formik.values.defaultValue}
            onChange={(e) => formik.setFieldValue('defaultValue', e.target.value)}
            isDisabled={formik.values.type === AttributeType.ACTION}
            type={formik.values.type === AttributeType.NUMBER ? 'number' : 'text'}
          />
        )}

        {formik.values.type === AttributeType.TEXT && (
          <>
            <Input
              placeholder='Add Option'
              id='option'
              value={restraint}
              onChange={(e) => setRestraint(e.target.value)}
              onKeyDown={(e) => {
                if (!restraint) return;
                if (e.key === 'Enter') {
                  e.preventDefault();
                  formik.setFieldValue('restraints', [...formik.values.restraints, restraint]);
                  setRestraint('');
                }
              }}
            />
            <Stack direction='row' spacing={2} alignItems='flex-start'>
              <Tooltip
                label={
                  <Text>
                    Add options to restrict the value of this attribute. Attributes with options
                    will be controlled through dropdowns.
                  </Text>
                }>
                <Button
                  variant='text'
                  isDisabled={!restraint}
                  onClick={() => {
                    formik.setFieldValue('restraints', [...formik.values.restraints, restraint]);
                    setRestraint('');
                  }}>
                  Add
                </Button>
              </Tooltip>

              <Tooltip
                label={<Text>Add all the values of a column from a given chart to options</Text>}>
                <Button variant='text' onClick={() => setRestraintChartOpen(true)}>
                  Add from Chart
                </Button>
              </Tooltip>
            </Stack>
          </>
        )}

        {formik.values.restraints.length > 0 && (
          <Stack direction='row' spacing={2}>
            <Popover>
              <PopoverTrigger>
                <Text role='button'>Show Options</Text>
              </PopoverTrigger>
              <PopoverContent sx={{ maxHeight: '250px' }}>
                <Stack spacing={1} padding={2} sx={{ overflowY: 'auto' }}>
                  {formik.values.restraints.map((restraint, i) => (
                    <Stack key={restraint} direction='row' justify='space-between' align='center'>
                      <Text>{restraint}</Text>
                      <IconButton
                        aria-label='Remove'
                        variant='ghost'
                        onClick={(e) => {
                          e.stopPropagation();
                          if (formik.values.restraints.length === 1) {
                            formik.setFieldValue('restraints', []);
                          } else {
                            formik.setFieldValue(
                              'restraints',
                              formik.values.restraints.filter((r) => r !== restraint),
                            );
                          }
                        }}>
                        <Delete />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              </PopoverContent>
            </Popover>
          </Stack>
        )}

        {restraintChartOpen && (
          <SetAttributeRestraints
            onClose={() => setRestraintChartOpen(false)}
            onAddRestraints={(restraints: string[]) => {
              formik.setFieldValue('restraints', [...formik.values.restraints, ...restraints]);
            }}
          />
        )}

        <Textarea
          placeholder='Description'
          value={formik.values.description}
          onChange={(e) => formik.setFieldValue('description', e.target.value)}
        />
      </Stack>
    </>
  );
};
