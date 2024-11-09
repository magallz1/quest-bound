import { createContext } from 'react';

type IJournalContext = {
  readOnly: boolean;
};

export const JournalContext = createContext<IJournalContext>(null!);
export const JournalProvider = JournalContext.Provider;
