import React, { createContext, useState } from 'react';

type SettingsContext = {
  settingsPage: string;
  setSettingsPage: React.Dispatch<React.SetStateAction<string>>;
  dicePanelOpen: boolean;
  setDicePanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  settingsModalOpen: boolean;
  openSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectModalOpen: boolean;
  setSelectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SettingsContext = createContext<SettingsContext>(null!);
export const SettingsProvider = SettingsContext.Provider;

export const useSettingsContextState = (): SettingsContext => {
  const [settingsModalOpen, openSettingsModal] = useState<boolean>(false);
  const [dicePanelOpen, setDicePanelOpen] = useState<boolean>(false);

  const [settingsPage, setSettingsPage] = useState<string>('profile');
  const [selectModalOpen, setSelectModalOpen] = useState<boolean>(false);

  return {
    settingsModalOpen,
    openSettingsModal,
    dicePanelOpen,
    setDicePanelOpen,
    settingsPage,
    setSettingsPage,
    selectModalOpen,
    setSelectModalOpen,
  };
};
