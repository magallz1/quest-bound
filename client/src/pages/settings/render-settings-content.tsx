import { CharacterDetails, SelectCharacterSheetTemplate } from './character-settings';
import { RulesetDetails } from './ruleset-settings';
import { ModuleSettings } from './ruleset-settings/modules';
import { SheetDetailsMenu } from './sheet-settings/sheet-details';
import { SettingsProfile } from './user-settings';

interface Props {
  settingsPage: string;
}

export const RenderSettingsContent = ({ settingsPage }: Props) => {
  const renderPage = () => {
    switch (settingsPage) {
      case 'profile':
        return <SettingsProfile />;
      case 'ruleset-settings':
        return <RulesetDetails />;
      case 'ruleset-modules':
        return <ModuleSettings />;
      case 'character-details':
        return <CharacterDetails />;
      case 'character-sheet-template':
        return <SelectCharacterSheetTemplate />;
      case 'sheet-settings':
        return <SheetDetailsMenu />;
      default:
        return null;
    }
  };

  return renderPage();
};
