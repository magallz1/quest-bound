import { AttributeContext, ComponentData, SheetComponent } from '@/libs/compass-api';
import { useContext } from 'react';
import { useEditorStore } from '../editor-store';

export const useConditionalRender = (component?: SheetComponent) => {
  const { viewMode } = useEditorStore();
  const attributeContext = useContext(AttributeContext);
  if (!component) return { shouldRender: true };
  const attributes = attributeContext?.attributes ?? [];

  const data = JSON.parse(component.data) as ComponentData;
  const { conditionalRenderAttributeId, conditionalRenderInverse } = data;

  let shouldRender = true;

  if (conditionalRenderAttributeId && viewMode) {
    const attribute = attributes.find((attr) => attr.id === conditionalRenderAttributeId);

    const isTrue = attribute?.value === 'true';

    if (conditionalRenderInverse) {
      if (isTrue) shouldRender = false;
    } else {
      if (!isTrue) shouldRender = false;
    }
  }

  return {
    shouldRender,
  };
};
