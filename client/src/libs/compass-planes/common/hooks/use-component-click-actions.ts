import { AttributeContext, ComponentData } from '@/libs/compass-api';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuildPageLink } from './use-build-page-link';

interface ComponentClickActionsProps {
  data: ComponentData;
  disabled: boolean;
}

export const useComponentClickActions = ({ data, disabled }: ComponentClickActionsProps) => {
  const attributeContext = useContext(AttributeContext);
  const pageLink = useBuildPageLink(data.pageId);
  const navigate = useNavigate();

  const triggerAction = () => {
    if (data.actionId) {
      attributeContext?.triggerAction(data.actionId);
    }
  };

  const handleNavigate = () => {
    if (!pageLink) return;

    if (pageLink.includes('http')) {
      window.open(pageLink, '_blank');
      return;
    }

    navigate(pageLink);
  };

  const onClick = () => {
    if (disabled) return;
    if (data.actionId) {
      triggerAction?.();
    }

    if (pageLink) {
      handleNavigate();
    }
  };

  return {
    onClick,
    clickable: data.actionId || pageLink,
  };
};
