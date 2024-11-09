import { useRuleset } from '@/libs/compass-api';
import { ClientSideLink, Img } from '@/libs/compass-core-composites';
import { Button, Skeleton, Stack, Text } from '@/libs/compass-core-ui';
import { EnvContext } from '@/libs/compass-web-utils';
import { useContext } from 'react';
import { useLocation, useParams } from 'react-router-dom';

export const RulesetNav = ({ onClose }: { onClose: () => void }) => {
  const { rulesetId } = useParams();
  const { ruleset, loading } = useRuleset(rulesetId);
  const pathname = useLocation().pathname;

  if (!ruleset) return null;

  const NavButton = ({ label, path, env }: { label: string; path: string; env?: string }) => {
    const { environment } = useContext(EnvContext);
    if (env && environment !== env) return null;

    return (
      <Button
        variant='text'
        color={pathname.includes(path) ? 'secondary' : 'inherit'}
        sx={{
          flexGrow: '1',
          display: 'flex',
          justifyContent: 'start',
        }}
        onClick={onClose}
        href={`/rulesets/${ruleset.id}/${path}`}
        LinkComponent={ClientSideLink}>
        <Text>{label}</Text>
      </Button>
    );
  };

  if (loading) {
    return <Skeleton height={40} width={140} />;
  }

  return (
    <Stack flexGrow={1} spacing={2}>
      <Stack direction='row' spacing={2} alignItems='center' pl={2} pr={2}>
        <Img src={ruleset.image?.src ?? ''} />
        <Text>{ruleset.title}</Text>
      </Stack>

      <Stack pl={1} pr={1}>
        <NavButton label='Attributes' path='attributes' />
        <NavButton label='Archetypes' path='archetypes' />
        <NavButton label='Charts' path='charts' />
        <NavButton label='Documents' path='documents' />
        <NavButton label='Items' path='items' />
        <NavButton label='Page Templates' path='page-templates' />
        <NavButton label='Sheet Templates' path='sheet-templates' />
      </Stack>
    </Stack>
  );
};
