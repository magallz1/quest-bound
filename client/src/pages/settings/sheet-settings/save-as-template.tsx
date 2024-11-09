import { useCreatePageTemplate } from '@/libs/compass-api';
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const SaveAsTemplate = () => {
  const [searchParams] = useSearchParams();
  const pageId = searchParams.get('page') ?? '';
  const [title, setTitle] = useState<string>('');

  const { createPageTemplateFromPage, loading: createTemplateLoading } = useCreatePageTemplate();

  const handleSaveAsTemplate = () => {
    if (!pageId) return;
    createPageTemplateFromPage({ pageId, title });
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button sx={{ width: 150 }}>Save as Template</Button>
      </PopoverTrigger>
      <PopoverContent sx={{ padding: 2 }}>
        <Input placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
        <PopoverFooter>
          <Button onClick={handleSaveAsTemplate} isLoading={createTemplateLoading}>
            Save
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};
