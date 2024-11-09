import {
  AttributeType,
  Image,
  useAttribute,
  useCreateAttribute,
  useUpdateAttribute,
} from '@/libs/compass-api';
import { ImageWithUpload } from '@/libs/compass-core-composites';
import { useNotifications } from '@/stores';
import { Button, Checkbox, Input, Stack, Text, Textarea } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';

type FormValues = {
  name: string;
  description: string;
  quantity: number;
  category?: string;
  stackable?: boolean;
  equippable?: boolean;
  weight?: number;
  height?: number;
  width?: number;
  slots?: string;
  maxQuantity?: number;
};

const validationSchema = yup.object({
  name: yup.string().required('Title is required'),
});

interface Props {
  onComplete?: () => void;
  itemId?: string;
}

export const ItemForm = ({ itemId, onComplete }: Props) => {
  const { rulesetId } = useParams();
  const { addNotification } = useNotifications();

  const { createAttribute, loading } = useCreateAttribute();
  const { updateAttribute } = useUpdateAttribute();

  const { attribute: item } = useAttribute(itemId);

  const [img, setImg] = useState<Image | null>(null);

  const handleSubmit = async (values: FormValues) => {
    if (!rulesetId) return;

    const input = {
      rulesetId,
      description: values.description,
      name: values.name,
      category: values.category,
      data: JSON.stringify({
        quantity: values.quantity ?? 1,
        maxQuantity: values.maxQuantity,
        stackable: values.stackable,
        equippable: values.equippable,
        weight: values.weight,
        height: values.height,
        width: values.width,
        slots: values.slots,
      }),
    };

    if (!!itemId) {
      await updateAttribute({
        id: itemId,
        ...input,
      });
    } else {
      await createAttribute({
        ...input,
        type: AttributeType.ITEM,
        defaultValue: '',
        imageId: img?.id,
      });
    }

    handleComplete(!!itemId);
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      description: '',
      category: '',
      stackable: true,
      equippable: true,
      quantity: 1,
      height: 4,
      width: 4,
      weight: 0,
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (item) {
      formik.setValues({
        name: item.name,
        description: item.description ?? '',
        category: item.category ?? '',
        quantity: JSON.parse(item.data ?? '{}').quantity ?? 1,
        maxQuantity: JSON.parse(item.data ?? '{}').maxQuantity,
        weight: JSON.parse(item.data ?? '{}').weight,
        height: JSON.parse(item.data ?? '{}').height,
        width: JSON.parse(item.data ?? '{}').width,
        slots: JSON.parse(item.data ?? '{}').slots,
        stackable: JSON.parse(item.data ?? '{}').stackable ?? true,
        equippable: JSON.parse(item.data ?? '{}').equippable ?? true,
      });
    }
  }, [item]);

  const handleComplete = (isUpdate?: boolean) => {
    addNotification({
      message: isUpdate ? 'Item Updated' : 'Item Created',
      status: 'success',
    });

    formik.resetForm();

    onComplete?.();
  };

  const onAddImage = (image: Image) => {
    if (!item) {
      setImg(image);
      return;
    }

    updateAttribute({
      id: item.id,
      imageId: image.id,
    });
  };

  const onRemove = () => {
    if (!item) return;
    updateAttribute({
      id: item.id,
      imageId: null,
    });
  };

  return (
    <Stack spacing={6} width='100%'>
      <Stack direction='row' spacing={4} flexWrap='wrap'>
        <Button isDisabled={!formik.values.name} isLoading={loading} onClick={formik.submitForm}>
          {!!item ? 'Update' : 'Create'}
        </Button>
      </Stack>
      <Input
        placeholder='Title'
        value={formik.values.name}
        onChange={(e) => formik.setFieldValue('name', e.target.value)}
      />
      <Input
        placeholder='Category'
        value={formik.values.category}
        onChange={(e) => formik.setFieldValue('category', e.target.value)}
      />

      <ImageWithUpload
        onSelect={onAddImage}
        onRemove={onRemove}
        src={img?.src ?? item?.image?.src ?? ''}
        containerStyle={{ height: 150, width: 150 }}
        imageStyle={{ height: 150, width: 150 }}
      />

      <Textarea
        placeholder='Description'
        value={formik.values.description}
        onChange={(e) => formik.setFieldValue('description', e.target.value)}
      />

      <Stack direction='row' spacing={5}>
        <Checkbox
          isChecked={formik.values.stackable}
          onChange={(e) => formik.setFieldValue('stackable', e.target.checked)}>
          Stackable
        </Checkbox>
        <Checkbox
          isChecked={formik.values.equippable}
          onChange={(e) => formik.setFieldValue('equippable', e.target.checked)}>
          Equippable
        </Checkbox>
      </Stack>

      <Stack direction='row' spacing={5} flexWrap='wrap'>
        <Stack spacing={6}>
          <Stack>
            <Text fontSize='0.8rem'>Default Quantity</Text>
            <Input
              type='number'
              min={1}
              isDisabled={!formik.values.stackable}
              placeholder='Default Quantity'
              value={formik.values.quantity}
              onChange={(e) => formik.setFieldValue('quantity', e.target.value)}
            />
          </Stack>
          <Stack>
            <Text fontSize='0.8rem'>Stack Limit</Text>
            <Input
              type='number'
              min={1}
              isDisabled={!formik.values.stackable}
              placeholder='Stack Limit'
              value={formik.values.maxQuantity}
              onChange={(e) => formik.setFieldValue('maxQuantity', e.target.value)}
            />
          </Stack>
        </Stack>
        <Stack spacing={6}>
          <Stack>
            <Text fontSize='0.8rem'>Height</Text>
            <Input
              type='number'
              placeholder='Height'
              min={1}
              value={formik.values.height}
              onChange={(e) => formik.setFieldValue('height', e.target.value)}
            />
          </Stack>

          <Stack>
            <Text fontSize='0.8rem'>Width</Text>
            <Input
              type='number'
              placeholder='Width'
              min={1}
              value={formik.values.width}
              onChange={(e) => formik.setFieldValue('width', e.target.value)}
            />
          </Stack>
        </Stack>
        <Stack spacing={6}>
          <Stack>
            <Text fontSize='0.8rem'>Weight</Text>
            <Input
              type='number'
              placeholder='Weight'
              value={formik.values.weight}
              onChange={(e) => formik.setFieldValue('weight', e.target.value)}
            />
          </Stack>
          <Stack>
            <Text fontSize='0.8rem'>Slots</Text>
            <Input
              placeholder='Comma separated list'
              value={formik.values.slots}
              onChange={(e) => formik.setFieldValue('slots', e.target.value)}
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
