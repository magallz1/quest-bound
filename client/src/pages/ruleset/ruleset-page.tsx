import { useRuleset } from '@/libs/compass-api';
import { Stack } from '@/libs/compass-core-ui';
import { useNotifications } from '@/stores';
import { RulesetEntity } from '@/types';
import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { RenderEntityContent } from './components/render-entity-content';

export const Ruleset = ({ page = 'attributes' }: { page?: RulesetEntity }) => {
  const { rulesetId } = useParams();

  useEffect(() => {
    if (rulesetId) {
      localStorage.setItem('last-viewed-ruleset-id', rulesetId);
    }
  }, [rulesetId]);

  const { addNotification } = useNotifications();

  const { ruleset, loading, canEdit } = useRuleset(rulesetId);

  if (!rulesetId || (!loading && !ruleset)) {
    addNotification({
      status: 'error',
      message: 'Ruleset not found',
    });

    if (localStorage.getItem('last-viewed-ruleset-id') === rulesetId) {
      localStorage.removeItem('last-viewed-ruleset-id');
    }

    return <Navigate to='/' />;
  }

  if (loading) {
    return null;
  }

  if (!canEdit && ruleset) {
    localStorage.removeItem('last-viewed-ruleset-id');
    return <Navigate to={`/`} />;
  }

  return (
    <Stack width='100%' sx={{ height: 'calc(100dvh - 60px)' }} id='ruleset-page'>
      <RenderEntityContent selectedEntity={page} />
    </Stack>
  );
};
