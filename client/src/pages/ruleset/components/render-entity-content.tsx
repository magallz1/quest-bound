import { AttributeType } from '@/libs/compass-api';
import { Stack } from '@/libs/compass-core-ui';
import { RulesetEntity } from '../../../types';
import { ArchetypesEntityPage } from '../archetypes';
import { AttributesEntityPage } from '../attributes';
import { ChartsEntityPage } from '../charts';
import { DocumentsEntityPage } from '../documents/documents-entity-page';
import { PageTemplatesEntityPage } from '../page-templates';
import { TemplatesEntityPage } from '../templates';

interface RenderEntityContentProps {
  selectedEntity: RulesetEntity | null;
}

export const RenderEntityContent = ({ selectedEntity }: RenderEntityContentProps) => {
  const renderContent = () => {
    switch (selectedEntity) {
      case 'sheet-templates':
        return <TemplatesEntityPage />;
      case 'page-templates':
        return <PageTemplatesEntityPage />;
      case 'charts':
        return <ChartsEntityPage />;
      case 'attributes':
        return <AttributesEntityPage />;
      case 'archetypes':
        return <ArchetypesEntityPage />;
      case 'documents':
        return <DocumentsEntityPage />;
      case 'items':
        return <AttributesEntityPage type={AttributeType.ITEM} />;
      default:
        return null;
    }
  };

  return (
    <Stack sx={{ flexGrow: 1 }} padding={2}>
      {renderContent()}
    </Stack>
  );
};
