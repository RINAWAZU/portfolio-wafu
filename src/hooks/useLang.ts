'use client';

import { useContext } from 'react';
import { LangContext, type LangContextValue } from '@/providers/LangProvider';

export function useLang(): LangContextValue {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLang must be used within LangProvider');
  }
  return context;
}
