'use client';

import type { ReactNode } from 'react';

import { LottoV2ContractProvider } from '@/hooks/useLottoV2Contract';

export function AppProvidersV2({ children }: { children: ReactNode }) {
    return <LottoV2ContractProvider>{children}</LottoV2ContractProvider>;
}
