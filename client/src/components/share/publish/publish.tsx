import { usePublishRuleset, useRuleset } from '@/libs/compass-api';
import { Center, Spinner } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { NotPublished } from './not-published';
import { Published } from './published';

export const Publish = () => {
  const { rulesetId } = useParams();
  const { ruleset } = useRuleset(rulesetId);
  const isPublished = ruleset?.published;

  const {
    publishRuleset,
    bumpRulesetVersion,
    loading: publishing,
    syncLoading,
  } = usePublishRuleset();

  const handlePublish = async () => {
    if (!ruleset) return;

    if (isPublished) {
      await bumpRulesetVersion(
        {
          id: ruleset.id,
          version: ruleset.version + 1,
        },
        {
          live: Boolean(ruleset.live),
          includesAI: Boolean(ruleset.includesAI),
          includesPDF: Boolean(ruleset.includesPDF),
          explicit: Boolean(ruleset.explicit),
        },
      );
    } else {
      await publishRuleset({ id: ruleset.id, version: 1 });
    }
  };

  if (!isPublished) {
    return <NotPublished onPublish={handlePublish} loading={publishing} />;
  }

  if (publishing && !isPublished) {
    return (
      <Center sx={{ height: '100px' }}>
        <Spinner thickness='4px' speed='1s' emptyColor='gray.200' color='blue.500' size='xl' />
      </Center>
    );
  }

  return <Published ruleset={ruleset} onSync={handlePublish} loading={publishing || syncLoading} />;
};
