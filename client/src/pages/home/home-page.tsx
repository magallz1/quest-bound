import { useCurrentUser } from '@/libs/compass-api';
import { useDeviceSize } from '@/libs/compass-core-ui';
import { Navigate } from 'react-router-dom';
import { SelectMenu } from './select-menu';

export const HomePage = () => {
  const { isCreator } = useCurrentUser();
  const { mobile } = useDeviceSize();
  const lastRulesetId = localStorage.getItem('last-viewed-ruleset-id');

  if (lastRulesetId && !mobile && isCreator) {
    return <Navigate to={`/rulesets/${lastRulesetId}/attributes`} />;
  }

  return <SelectMenu />;
};
