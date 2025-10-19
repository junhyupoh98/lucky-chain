'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Interface, ZeroAddress, formatEther } from 'ethers';

import lottoAbi from '../../lib/abi.json';
import { useLottoContractContext } from '@/hooks/useLottoContract';
import type { TicketData } from '@/hooks/useLottoContract';

const NUMBER_OF_PICKS = 6;
const MIN_NUMBER = 1;
const MAX_NUMBER = 45;

type SubmissionStatus = 'idle' | 'uploading' | 'minting' | 'success' | 'error';
type EntryMode = 'manual' | 'auto';

type FormNumbers = {
    main: string[];
    lucky: string;
};

function generateUniqueNumbers(): { numbers: number[]; lucky: number } {
    const picks = new Set<number>();
    while (picks.size < NUMBER_OF_PICKS) {
        const value = Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
        picks.add(value);
    }
    const main = Array.from(picks).sort((a, b) => a - b);

    let lucky = Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
    while (picks.has(lucky)) {
        lucky = Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
    }

    return { numbers: main, lucky };
}

function formatRoundPhase(phase: string | undefined): string {
    if (!phase) return '—';
    switch (phase) {
        case 'sales':
            return 'Ticket sales';
        case 'drawing':
            return 'Drawing';
        case 'claimable':
            return 'Claimable';
        default:
            return phase;
    }
}

export default function Home() {
    const {
        address,
        chainId,
        expectedChainId,
        isWalletAvailable,
        isConnecting,
        isWrongNetwork,
        pendingTransaction,
        connectWallet,
        switchToExpectedNetwork,
        getTicketPrice,
        getActiveRound,
        buyTicket,
        getTicketData,
    } = useLottoContractContext();

    const [mode, setMode] = useState<EntryMode>('manual');
    const [manualNumbers, setManualNumbers] = useState<FormNumbers>({
        main: Array.from({ length: NUMBER_OF_PICKS }, () => ''),
        lucky: '',
    });
    const [autoNumbers, setAutoNumbers] = useState(() => generateUniqueNumbers());
    const [status, setStatus] = useState<SubmissionStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successTokenId, setSuccessTokenId] = useState<string | null>(null);
    const [transactionHash, setTransactionHash] = useState<string | null>(null);
    const [ticketPrice, setTicketPrice] = useState<string | null>(null);
    const [activeRoundId, setActiveRoundId] = useState<string | null>(null);
    const [activePhase, setActivePhase] = useState<string | undefined>(undefined);
    const [latestTicket, setLatestTicket] = useState<TicketData | null>(null);

    const lottoInterface = useMemo(() => new Interface(lottoAbi), []);

    useEffect(() => {
        let isMounted = true;

        const loadInitialData = async () => {
            try {
                const [price, round] = await Promise.all([
                    getTicketPrice(),
                    getActiveRound(),
                ]);
                if (!isMounted) return;
                if (price !== null) {
                    setTicketPrice(formatEther(price));
                } else {
                    setTicketPrice(null);
                }
                if (round) {
                    setActiveRoundId(round.id.toString());
                    setActivePhase(round.phase);
                } else {
                    setActiveRoundId(null);
                    setActivePhase(undefined);
                }
            } catch (error) {
                console.error('Failed to load contract state', error);
            }
        };

        if (!isWrongNetwork) {
            void loadInitialData();
        }
        return () => {
            isMounted = false;
        };
    }, [getActiveRound, getTicketPrice, isWrongNetwork]);

    const handleManualNumberChange = (index: number, value: string) => {
        const sanitized = value.replace(/[^0-9]/g, '');
        setManualNumbers((previous) => {
            const main = [...previous.main];
            main[index] = sanitized;
            return { ...previous, main };
        });
    };
    const handleLuckyChange = (value: string) => {
        const sanitized = value.replace(/[^0-9]/g, '');
        setManualNumbers((previous) => ({ ...previous, lucky: sanitized }));
    };
    const regenerateAutoNumbers = () => {
        setAutoNumbers(generateUniqueNumbers());
    };

    const extractMintedTokenId = (receipt: Awaited<ReturnType<typeof buyTicket>>) => {
        if (!receipt) return null;

        for (const log of receipt.logs ?? []) {
            try {
                const parsed = lottoInterface.parseLog({ data: log.data, topics: Array.from(log.topics) });
                if (parsed?.name === 'TicketPurchased') {
                    const tokenId = parsed.args?.ticketId ?? parsed.args?.[1];
                    if (tokenId) {
                        return tokenId.toString();
                    }
                }
                if (parsed?.name === 'Transfer') {
                    const from = (parsed.args?.from ?? parsed.args?.[0]) as string | undefined;
                    const tokenId = parsed.args?.tokenId ?? parsed.args?.id ?? parsed.args?.value ?? parsed.args?.[2];
                    if (typeof from === 'string' && from.toLowerCase() === ZeroAddress.toLowerCase() && tokenId) {
                        return tokenId.toString();
                    }
                }
            } catch {
                // ignore logs not in ABI
            }
        }

        return null;
    };

    const parseManualNumbers = (): { numbers: number[]; lucky: number } | null => {
        const numeric = manualNumbers.main.map((value) => Number.parseInt(value, 10));
        if (numeric.some((value) => Number.isNaN(value))) {
            setErrorMessage('Please provide all six numbers.');
            return null;
        }
        if (numeric.some((value) => value < MIN_NUMBER || value > MAX_NUMBER)) {
            setErrorMessage(`Numbers must be between ${MIN_NUMBER} and ${MAX_NUMBER}.`);
            return null;
        }
        const unique = new Set(numeric);
        if (unique.size !== NUMBER_OF_PICKS) {
            setErrorMessage('Numbers must be unique.');
            return null;
        }
        const lucky = Number.parseInt(manualNumbers.lucky, 10);
        if (Number.isNaN(lucky)) {
            setErrorMessage('Please provide a lucky number.');
            return null;
        }
        if (lucky < MIN_NUMBER || lucky > MAX_NUMBER) {
            setErrorMessage(`Lucky number must be between ${MIN_NUMBER} and ${MAX_NUMBER}.`);
            return null;
        }
        if (unique.has(lucky)) {
            setErrorMessage('Lucky number must be different from the six main numbers.');
            return null;
        }
        return { numbers: numeric, lucky };
    };
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus('idle');
        setErrorMessage(null);
        setSuccessTokenId(null);
        setTransactionHash(null);

        if (!address) {
            setStatus('error');
            setErrorMessage('Connect your wallet before purchasing a ticket.');
            return;
        }
        if (isWrongNetwork) {
            setStatus('error');
            setErrorMessage(`Switch to chain ID ${expectedChainId} before purchasing.`);
            return;
        }
        if (!activeRoundId) {
            setStatus('error');
            setErrorMessage('No active round available for ticket sales.');
            return;
        }

        let selectedNumbers: number[];
        let luckyNumber: number;
        let isAutoPick = false;

        if (mode === 'manual') {
            const parsed = parseManualNumbers();
            if (!parsed) {
                setStatus('error');
                return;
            }
            selectedNumbers = parsed.numbers;
            luckyNumber = parsed.lucky;
        } else {
            selectedNumbers = autoNumbers.numbers;
            luckyNumber = autoNumbers.lucky;
            isAutoPick = true;
        }

        try {
            setStatus('uploading');
            const metadataResponse = await fetch('/api/uploadMetadata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    numbers: selectedNumbers,
                    luckyNumber,
                    drawId: activeRoundId,
                    walletAddress: address,
                    isAutoPick,
                }),
            });

            if (!metadataResponse.ok) {
                const body = await metadataResponse.json().catch(() => ({ error: 'Metadata upload failed.' }));
                throw new Error(body.error ?? 'Metadata upload failed.');
            }

            const { ipfsUri } = (await metadataResponse.json()) as { ipfsUri: string };

            setStatus('minting');
            const receipt = await buyTicket(selectedNumbers, luckyNumber, isAutoPick, ipfsUri);
            if (!receipt) {
                throw new Error('Transaction could not be confirmed.');
            }

            const tokenId = extractMintedTokenId(receipt);
            setTransactionHash(receipt.hash);
            setSuccessTokenId(tokenId);
            setStatus('success');

            if (tokenId) {
                const ticket = await getTicketData(tokenId);
                setLatestTicket(ticket);
            }
        } catch (error) {
            console.error('Ticket purchase failed', error);
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Ticket purchase failed.');
        }
    };

    const manualInputs = manualNumbers.main.map((value, index) => (
        <input
            key={index}
            value={value}
            onChange={(event) => handleManualNumberChange(index, event.target.value)}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder={`#${index + 1}`}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
        />
    ));

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-12">
                <header className="flex flex-col gap-2">
                    <h1 className="text-4xl font-semibold">Lucky Chain Lottery</h1>
                    <p className="text-sm text-slate-400">
                        Purchase weekly NFT tickets with six numbers and a lucky bonus number. Choose your own picks or let the system generate a random ticket for you.
                    </p>
                </header>

                <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                    <h2 className="text-lg font-semibold">Wallet status</h2>
                    <div className="mt-3 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
                        <div>
                            <span className="font-medium text-slate-200">Address:</span>{' '}
                            {address ?? 'Not connected'}
                        </div>
                        <div>
                            <span className="font-medium text-slate-200">Network:</span>{' '}
                            {isWrongNetwork ? `Wrong network (expected ${expectedChainId}, current ${chainId ?? 'unknown'})` : 'Ready'}
                        </div>
                        <div>
                            <span className="font-medium text-slate-200">Ticket price:</span>{' '}
                            {ticketPrice ? `${ticketPrice} KAIA` : '—'}
                        </div>
                        <div>
                            <span className="font-medium text-slate-200">Active round:</span>{' '}
                            {activeRoundId ?? '—'} ({formatRoundPhase(activePhase)})
                        </div>
                        <div>
                            <span className="font-medium text-slate-200">Pending tx:</span>{' '}
                            {pendingTransaction ?? '—'}
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                        {!isWalletAvailable && (
                            <p className="text-sm text-red-400">No wallet detected.</p>
                        )}
                        <button
                            type="button"
                            onClick={() => void connectWallet()}
                            disabled={isConnecting}
                            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isConnecting ? 'Connecting…' : 'Connect wallet'}
                        </button>
                        {isWrongNetwork && (
                            <button
                                type="button"
                                onClick={() => void switchToExpectedNetwork()}
                                className="rounded-lg border border-amber-400 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/20"
                            >
                                Switch network
                            </button>
                        )}
                    </div>
                </section>

                <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                    <h2 className="text-lg font-semibold">Choose numbers</h2>
                    <div className="mt-3 flex gap-3 text-sm">
                        <button
                            type="button"
                            onClick={() => setMode('manual')}
                            className={`rounded-lg px-4 py-2 font-semibold transition ${
                                mode === 'manual'
                                    ? 'bg-emerald-500 text-emerald-950'
                                    : 'border border-slate-700 text-slate-200 hover:border-emerald-400'
                            }`}
                        >
                            Manual pick
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('auto')}
                            className={`rounded-lg px-4 py-2 font-semibold transition ${
                                mode === 'auto'
                                    ? 'bg-emerald-500 text-emerald-950'
                                    : 'border border-slate-700 text-slate-200 hover:border-emerald-400'
                            }`}
                        >
                            Auto pick
                        </button>
                    </div>

                    {mode === 'manual' ? (
                        <div className="mt-4 space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-300">Main numbers</h3>
                                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {manualInputs}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-300">Lucky number</h3>
                                <input
                                    value={manualNumbers.lucky}
                                    onChange={(event) => handleLuckyChange(event.target.value)}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    placeholder="Lucky"
                                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none sm:w-40"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-300">Auto-generated numbers</h3>
                                    <p className="text-xs text-slate-500">Unique numbers 1–45 with a bonus lucky number.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={regenerateAutoNumbers}
                                    className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-emerald-400"
                                >
                                    Regenerate
                                </button>
                            </div>
                            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 text-lg font-semibold tracking-wide text-emerald-300">
                                {autoNumbers.numbers.join('  ')}
                                <span className="ml-3 text-sm text-emerald-200">Lucky {autoNumbers.lucky}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={status === 'uploading' || status === 'minting'}
                        >
                            {status === 'uploading'
                                ? 'Uploading metadata…'
                                : status === 'minting'
                                    ? 'Awaiting transaction…'
                                    : 'Buy ticket'}
                        </button>
                        {errorMessage && (
                            <p className="text-sm text-red-400">{errorMessage}</p>
                        )}
                        {status === 'success' && (
                            <div className="rounded-lg border border-emerald-600 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                                <p>Ticket purchased successfully.</p>
                                {successTokenId && <p>Token ID: {successTokenId}</p>}
                                {transactionHash && (
                                    <p>
                                        Transaction:{' '}
                                        <a
                                            href={`https://kairos.kaiascan.io/tx/${transactionHash}`}
                                            className="underline"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            View on explorer
                                        </a>
                                    </p>
                                )}
                            </div>
                        )}
                    </form>
                </section>

                {latestTicket && (
                    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                        <h2 className="text-lg font-semibold">Latest ticket</h2>
                        <dl className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                            <div>
                                <dt className="text-slate-500">Token ID</dt>
                                <dd className="font-medium text-slate-100">{latestTicket.id}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Round</dt>
                                <dd className="font-medium text-slate-100">{latestTicket.roundId}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Numbers</dt>
                                <dd className="font-medium text-slate-100">{latestTicket.numbers.join(', ')}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Lucky number</dt>
                                <dd className="font-medium text-slate-100">{latestTicket.luckyNumber}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Mode</dt>
                                <dd className="font-medium text-slate-100">{latestTicket.isAutoPick ? 'Auto' : 'Manual'}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Claimed</dt>
                                <dd className="font-medium text-slate-100">{latestTicket.claimed ? 'Yes' : 'No'}</dd>
                            </div>
                        </dl>
                    </section>
                )}
            </div>
        </main>
    );
}