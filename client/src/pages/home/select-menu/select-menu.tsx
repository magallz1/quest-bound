import { Character, Ruleset } from '@/libs/compass-api';
import { Stack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Characters } from './characters';
import { CustomRulesets } from './custom-rulesets';
import { SelectCategory } from './select-category';
import { SelectionPanel } from './selection-panel';
import { Shelf } from './shelf';

export const SelectMenu = () => {
  const [selection, setSelection] = useState<Ruleset | Character | null>(null);

  const [categorySelection, setCategorySelection] = useState<string>('My Shelf');

  useEffect(() => {
    setSelection(null);
  }, [categorySelection]);

  const renderContent = () => {
    switch (categorySelection) {
      case 'My Shelf':
        return <Shelf onSelect={setSelection} selection={selection} />;
      case 'Characters':
        return <Characters onSelect={setSelection} selection={selection as Character} />;
      case 'Custom Rulesets':
        return <CustomRulesets onSelect={setSelection} selection={selection as Ruleset} />;
    }
  };

  return (
    <>
      <Stack direction='row'>
        <SelectCategory selection={categorySelection} setSelection={setCategorySelection} />
        <section style={{ padding: '16px', height: '60dvh', flexGrow: 1 }}>
          {renderContent()}
        </section>
      </Stack>
      <SelectionPanel selection={selection} onClose={() => setSelection(null)} />
    </>
  );
};
