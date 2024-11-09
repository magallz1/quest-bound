import { Ruleset, usePublishRuleset, useUpdateRuleset } from '@/libs/compass-api';
import { EnvContext } from '@/libs/compass-web-utils';
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Link,
  Progress,
  Stack,
  Switch,
  Tooltip,
} from '@chakra-ui/react';
import { ContentCopy, Refresh } from '@mui/icons-material';
import { useContext } from 'react';

interface Props {
  ruleset: Ruleset;
  onSync: () => void;
  loading: boolean;
}

export const Published = ({ ruleset, onSync, loading }: Props) => {
  const { domain } = useContext(EnvContext);
  const { updateRuleset } = useUpdateRuleset();
  const { updatePublishedRuleset } = usePublishRuleset();
  const rulesetPermissions = JSON.parse(ruleset?.rulesetPermissions ?? '{}');
  const canShareModules = rulesetPermissions.canShareModules;

  const isLive = Boolean(ruleset.live);
  const link = `${domain}/marketplace/${ruleset.id}`;
  const truncatedLink = link.length > 50 ? `${link.slice(0, 50)}...` : link;

  const handleSetRulesetPermissions = async (key: string, value: string | boolean) => {
    if (!ruleset) return;

    if (key !== 'canShareModules') {
      await updatePublishedRuleset({
        id: ruleset.id,
        [key]: value,
      });
    } else {
      await updateRuleset({
        id: ruleset.id,
        rulesetPermissions: JSON.stringify({
          ...rulesetPermissions,
          [key]: value,
        }),
      });
      onSync();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link);
  };

  return (
    <Stack>
      <Tooltip label='Sync this content with the published version' placement='left'>
        <Button width='150px' leftIcon={<Refresh />} isDisabled={loading} onClick={onSync}>
          Sync
        </Button>
      </Tooltip>
      {loading && <Progress isIndeterminate size='xs' />}
      <Divider />
      {isLive && (
        <Stack direction='row' spacing={2} align='center' width='100%' justify='space-between'>
          <Link href={link} isExternal fontSize='0.9rem' opacity={0.8}>
            {truncatedLink}
          </Link>
          <Tooltip label='Copy link' placement='top'>
            <IconButton aria-label='Copy link' variant='ghost' onClick={copyLink}>
              <ContentCopy />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
      <FormControl display='flex' alignItems='center'>
        <Tooltip
          label='Launch a separate web page where users may add this to their shelves.'
          placement='left'>
          <FormLabel htmlFor='live' mb='0'>
            Live
          </FormLabel>
        </Tooltip>
        <Switch
          id='live'
          isChecked={isLive}
          onChange={(e) => handleSetRulesetPermissions('live', e.target.checked)}
        />
      </FormControl>
      <FormControl display='flex' alignItems='center'>
        <Tooltip
          label='This content includes explicit or graphic images or text. Users will be warned before viewing.'
          placement='left'>
          <FormLabel htmlFor='explicit' mb='0'>
            Explicit
          </FormLabel>
        </Tooltip>
        <Switch
          id='explicit'
          isChecked={Boolean(ruleset.explicit)}
          onChange={(e) => handleSetRulesetPermissions('explicit', e.target.checked)}
        />
      </FormControl>
      <FormControl display='flex' alignItems='center'>
        <Tooltip
          label='AI generated images or text were used in the creation of this content.'
          placement='left'>
          <FormLabel htmlFor='ai' mb='0'>
            This content incorporates AI
          </FormLabel>
        </Tooltip>
        <Switch
          id='ai'
          isChecked={Boolean(ruleset.includesAI)}
          onChange={(e) => handleSetRulesetPermissions('includesAI', e.target.checked)}
        />
      </FormControl>
      <FormControl display='flex' alignItems='center'>
        <Tooltip
          label='A PDF version of the rulebook is included within the ruleset documents.'
          placement='left'>
          <FormLabel htmlFor='pdf' mb='0'>
            PDF Included
          </FormLabel>
        </Tooltip>
        <Switch
          id='pdf'
          isChecked={Boolean(ruleset.includesPDF)}
          onChange={(e) => handleSetRulesetPermissions('includesPDF', e.target.checked)}
        />
      </FormControl>
      <FormControl display='flex' alignItems='center'>
        <Tooltip label='Users may create and publish modules for this ruleset.' placement='left'>
          <FormLabel htmlFor='modules' mb='0'>
            Allow Modules
          </FormLabel>
        </Tooltip>
        <Switch
          id='modules'
          isChecked={canShareModules}
          onChange={(e) => handleSetRulesetPermissions('canShareModules', e.target.checked)}
        />
      </FormControl>
    </Stack>
  );
};
