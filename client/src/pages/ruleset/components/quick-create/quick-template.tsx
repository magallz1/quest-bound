import { Image, TemplateType, useCreateSheet, useRuleset } from '@/libs/compass-api';
import { ImageWithUpload } from '@/libs/compass-core-composites';
import { useNotifications } from '@/stores';
import { Button, Input, Stack, Textarea } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';

type FormValues = {
  title: string;
  description: string;
  image: Image | null;
};

export const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
});

interface QuickTemplateProps {
  onCreate?: () => void;
  creatingPageTemplate?: boolean;
}

export const QuickTemplate = ({ onCreate, creatingPageTemplate }: QuickTemplateProps) => {
  const { rulesetId } = useParams();
  const { createSheetTemplate } = useCreateSheet();

  const { ruleset } = useRuleset(rulesetId);
  const { addNotification } = useNotifications();

  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      title: '',
      description: '',
      image: null,
    },
    validationSchema,
    onSubmit: (values) => {
      handleCreateTemplate(values);
    },
  });

  const handleCreateTemplate = async (values: FormValues) => {
    try {
      setLoading(true);

      await createSheetTemplate({
        title: values.title,
        description: values.description,
        rulesetId,
        templateType: creatingPageTemplate ? TemplateType.PAGE : TemplateType.SHEET,
        imageId: values.image?.id ?? undefined,
        details: ruleset?.details,
      });

      formik.resetForm();

      addNotification({
        message: 'Template created successfully',
        status: 'success',
      });

      onCreate?.();
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={6}>
      <Stack direction='row' spacing={4} flexWrap='wrap'>
        <Button isDisabled={!formik.values.title} onClick={formik.submitForm} isLoading={loading}>
          {creatingPageTemplate ? 'Create Page Template' : 'Create Sheet Template'}
        </Button>
      </Stack>
      <Input
        placeholder='Title'
        value={formik.values.title}
        onChange={(e) => formik.setFieldValue('title', e.target.value)}
      />
      <ImageWithUpload
        src={formik.values.image?.src ?? ''}
        imageStyle={{ height: 150, width: 150 }}
        containerStyle={{ height: 150, width: 150 }}
        onRemove={() => formik.setValues({ ...formik.values, image: null })}
        onSelect={(image) => formik.setValues({ ...formik.values, image })}
      />

      <Textarea
        placeholder='Description'
        value={formik.values.description}
        onChange={(e) => formik.setFieldValue('description', e.target.value)}
      />
    </Stack>
  );
};
