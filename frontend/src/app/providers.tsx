'use client';

import type { ReactNode } from 'react';

import { LottoContractProvider } from '@/hooks/useLottoContract';

export function AppProviders({ children }: { children: ReactNode }) {
    return <LottoContractProvider>{children}</LottoContractProvider>;
}