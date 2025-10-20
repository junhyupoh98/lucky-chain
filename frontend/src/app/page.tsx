'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Interface, ZeroAddress, formatEther } from 'ethers';

import lottoAbi from '../../lib/abi.json';
import { useLottoContractContext } from '@/hooks/useLottoContract';
import type { TicketData } from '@/hooks/useLottoContract';

const NUMBER_OF_PICKS = 6;
const MIN_NUMBER = 1;
const MAX_NUMBER = 45;
const MAX_TICKETS_PER_PURCHASE = 50;

type SubmissionStatus = 'idle' | 'uploading' | 'minting' | 'success' | 'error';
type EntryMode = 'manual' | 'auto';

type TicketDraft = {
    id: string;
    numbers: number[];
    luckyNumber: number | null;
};

type AutoTicketDraft = {
    numbers: number[];
    luckyNumber: number;
    signature: string;
};

const createSignature = (numbers: number[], luckyNumber: number) =>
    `${numbers.join('-')}|${luckyNumber}`;

function generateTicketCombination(existingSignatures: Set<string>): AutoTicketDraft {
    const picks = new Set<number>();
    while (picks.size < NUMBER_OF_PICKS) {
        const value = Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
        picks.add(value);
    }
    const numbers = Array.from(picks).sort((a, b) => a - b);

    let luckyNumber = Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
    while (picks.has(luckyNumber)) {
        luckyNumber = Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
    }

    const signature = createSignature(numbers, luckyNumber);
    if (existingSignatures.has(signature)) {
        return generateTicketCombination(existingSignatures);
    }

    existingSignatures.add(signature);
    return { numbers, luckyNumber, signature };
}

function generateTicketBatch(count: number): AutoTicketDraft[] {
    const sanitizedCount = Math.min(Math.max(count, 1), MAX_TICKETS_PER_PURCHASE);
    const signatures = new Set<string>();
    const tickets: AutoTicketDraft[] = [];

    while (tickets.length < sanitizedCount) {
        tickets.push(generateTicketCombination(signatures));
    }

    return tickets;
}

function createTicketDraft(): TicketDraft {
    const randomId =
        typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function'
            ? globalThis.crypto.randomUUID()
            : Math.random().toString(36).slice(2);

    return {
        id: randomId,
        numbers: [],
        luckyNumber: null,
    };
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
        buyTickets,
        getTicketData,
    } = useLottoContractContext();

    const [mode, setMode] = useState<EntryMode>('manual');
    const [manualTickets, setManualTickets] = useState<TicketDraft[]>([createTicketDraft()]);
    const [autoTicketCount, setAutoTicketCount] = useState<number>(5);
    const [autoTickets, setAutoTickets] = useState<AutoTicketDraft[]>(() => generateTicketBatch(5));
    const [status, setStatus] = useState<SubmissionStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successTokenIds, setSuccessTokenIds] = useState<string[]>([]);
    const [transactionHash, setTransactionHash] = useState<string | null>(null);
    const [ticketPrice, setTicketPrice] = useState<string | null>(null);
    const [activeRoundId, setActiveRoundId] = useState<string | null>(null);
    const [activePhase, setActivePhase] = useState<string | undefined>(undefined);
    const [latestTickets, setLatestTickets] = useState<TicketData[]>([]);

    const lottoInterface = useMemo(() => new Interface(lottoAbi), []);
    const numberOptions = useMemo(
        () => Array.from({ length: MAX_NUMBER }, (_, index) => index + 1),
        [],
    );

    const autoTicketCountOptions = useMemo(
        () => Array.from({ length: MAX_TICKETS_PER_PURCHASE }, (_, index) => index + 1),
        [],
    );

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

    useEffect(() => {
        setAutoTickets(generateTicketBatch(autoTicketCount));
    }, [autoTicketCount]);

    const regenerateAutoTickets = () => {
        setAutoTickets(generateTicketBatch(autoTicketCount));
    };

    const handleAutoTicketCountChange = (value: number) => {
        const sanitized = Number.isFinite(value) ? Math.trunc(value) : 1;
        const clamped = Math.min(Math.max(sanitized, 1), MAX_TICKETS_PER_PURCHASE);
        setAutoTicketCount(clamped);
    };

    const addManualTicket = () => {
        setManualTickets((previous) => {
            if (previous.length >= MAX_TICKETS_PER_PURCHASE) {
                return previous;
            }
            return [...previous, createTicketDraft()];
        });
    };

    const removeManualTicket = (index: number) => {
        setManualTickets((previous) => {
            if (previous.length <= 1) {
                return [createTicketDraft()];
            }
            return previous.filter((_, idx) => idx !== index);
        });
    
    const clearManualTicket = (index: number) => {
        setManualTickets((previous) =>
            previous.map((ticket, idx) =>
                idx === index
                    ?   {
                            ...ticket,
                            numbers: [],
                            luckyNumber: null,
                        }
                    : ticket,
            ),
        );
    };

    const toggleMainNumber = (index: number, value: number) => {
        setManualTickets((previous) =>
            previous.map((ticket, idx) => {
                if (idx !== index) {
                    return ticket;
                }

                const numbersSet = new Set(ticket.numbers);
                let luckyNumber = ticket.luckyNumber;

                if (numbersSet.has(value)) {
                    numbersSet.delete(value);
                } else {
                    if (numbersSet.size >= NUMBER_OF_PICKS) {
                        return ticket;
                    }
                    numbersSet.add(value);
                    if (luckyNumber === value) {
                        luckyNumber = null;
                    }
                }

                const updatedNumbers = Array.from(numbersSet).sort((a, b) => a - b);
                return {
                    ...ticket,
                    numbers: updatedNumbers,
                    luckyNumber,
                };
            }),
        );
    };

    const toggleLuckyNumber = (index: number, value: number) => {
        setManualTickets((previous) =>
            previous.map((ticket, idx) => {
                if (idx !== index) {
                    return ticket;
                }

                const numbersSet = new Set(ticket.numbers);
                let luckyNumber = ticket.luckyNumber;

                if (luckyNumber === value) {
                    luckyNumber = null;
                } else {
                    luckyNumber = value;
                    if (numbersSet.has(value)) {
                        numbersSet.delete(value);
                    }
                }

                const updatedNumbers = Array.from(numbersSet).sort((a, b) => a - b);
                return {
                    ...ticket,
                    numbers: updatedNumbers,
                    luckyNumber,
                };
            }),
        );
    };

    const validateManualTickets = (): { numbers: number[]; luckyNumber: number }[] | null => {
        if (manualTickets.length === 0) {
            setErrorMessage('Add at least one ticket.');
            return null;
        }

        const sanitized: { numbers: number[]; luckyNumber: number }[] = [];

        for (let i = 0; i < manualTickets.length; i += 1) {
            const ticket = manualTickets[i];
            if (ticket.numbers.length !== NUMBER_OF_PICKS) {
                setErrorMessage(`Ticket ${i + 1} must include ${NUMBER_OF_PICKS} numbers.`);
                return null;
            }

            const unique = new Set(ticket.numbers);
            if (unique.size !== NUMBER_OF_PICKS) {
                setErrorMessage(`Ticket ${i + 1} contains duplicate numbers.`);
                return null;
            }

            if (ticket.luckyNumber === null) {
                setErrorMessage(`Ticket ${i + 1} requires a lucky number.`);
                return null;
            }

            if (unique.has(ticket.luckyNumber)) {
                setErrorMessage(
                    `Ticket ${i + 1} must use a lucky number different from the six main numbers.`,
                );
                return null;
            }

            sanitized.push({ numbers: [...ticket.numbers], luckyNumber: ticket.luckyNumber });
        }

        return sanitized;
    };

    const extractMintedTokenIds = (receipt: Awaited<ReturnType<typeof buyTickets>>): string[] => {
        if (!receipt) return [];

        const collected = new Set<string>();

        for (const log of receipt.logs ?? []) {
            try {
                const parsed = lottoInterface.parseLog({ data: log.data, topics: Array.from(log.topics) });
                if (parsed?.name === 'TicketPurchased') {
                    const tokenId = parsed.args?.ticketId ?? parsed.args?.[1];
                    if (tokenId) {
                        collected.add(tokenId.toString());
                    }
                }
                if (parsed?.name === 'Transfer') {
                    const from = (parsed.args?.from ?? parsed.args?.[0]) as string | undefined;
                    const tokenId = parsed.args?.tokenId ?? parsed.args?.id ?? parsed.args?.value ?? parsed.args?.[2];
                    if (typeof from === 'string' && from.toLowerCase() === ZeroAddress.toLowerCase() && tokenId) {
                        collected.add(tokenId.toString());
                    }
                }
            } catch {
                // ignore logs not in ABI
            }
        }

        return Array.from(collected);
    };
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus('idle');
        setErrorMessage(null);
        setSuccessTokenIds([]);
        setTransactionHash(null);
        setLatestTickets([]);

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

        let ticketDrafts: Array<{ numbers: number[]; luckyNumber: number; isAutoPick: boolean }> = [];

        if (mode === 'manual') {
            const parsed = validateManualTickets();
            if (!parsed) {
                setStatus('error');
                return;
            }
            ticketDrafts = parsed.map((ticket) => ({
                numbers: ticket.numbers,
                luckyNumber: ticket.luckyNumber,
                isAutoPick: false,
            }));
        } else {
            ticketDrafts = autoTickets.map((ticket) => ({
                numbers: [...ticket.numbers],
                luckyNumber: ticket.luckyNumber,
                isAutoPick: true,
            }));
        }

        try {
            setStatus('uploading');
            const metadataResponse = await fetch('/api/uploadMetadata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tickets: ticketDrafts.map((ticket) => ({
                        numbers: ticket.numbers,
                        luckyNumber: ticket.luckyNumber,
                        isAutoPick: ticket.isAutoPick,
                    })),
                    drawId: activeRoundId,
                    walletAddress: address,
                }),
            });

            if (!metadataResponse.ok) {
                const body = await metadataResponse.json().catch(() => ({ error: 'Metadata upload failed.' }));
                throw new Error(body.error ?? 'Metadata upload failed.');
            }

            const metadataPayload = (await metadataResponse.json()) as {
                ipfsUri?: string;
                ipfsUris?: string[];
            };

            const ipfsUris = Array.isArray(metadataPayload.ipfsUris)
                ? metadataPayload.ipfsUris
                : metadataPayload.ipfsUri
                    ? [metadataPayload.ipfsUri]
                    : [];

            if (ipfsUris.length !== ticketDrafts.length) {
                throw new Error('Metadata upload did not return the expected number of URIs.');
            }

            const ticketsWithMetadata = ticketDrafts.map((ticket, index) => ({
                ...ticket,
                tokenURI: ipfsUris[index],
            }));

            setStatus('minting');
            if (mode === 'auto') {
                regenerateAutoTickets();
            }
            const receipt = await buyTickets(ticketsWithMetadata);
            if (!receipt) {
                throw new Error('Transaction could not be confirmed.');
            }

            const tokenIds = extractMintedTokenIds(receipt);
            setTransactionHash(receipt.hash);
            setSuccessTokenIds(tokenIds);
            setStatus('success');

            if (tokenIds.length > 0) {
                const fetched = await Promise.all(
                    tokenIds.map(async (tokenId) => {
                        try {
                            return await getTicketData(BigInt(tokenId));
                        } catch (error) {
                            console.error('Failed to load minted ticket', error);
                            return null;
                        }
                    }),
                );
                setLatestTickets(fetched.filter((ticket): ticket is TicketData => Boolean(ticket)));
            }
        } catch (error) {
            console.error('Ticket purchase failed', error);
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Ticket purchase failed.');
        }
    };

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
                        <div className="mt-4 space-y-6">
                            {manualTickets.map((ticket, index) => {
                                const selectedCount = ticket.numbers.length;
                                return (
                                    <div
                                        key={ticket.id}
                                        className="rounded-lg border border-slate-800 bg-slate-950/60 p-4"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-200">
                                                    Ticket {index + 1}
                                                </h3>
                                                <p className="text-xs text-slate-500">
                                                    {selectedCount}/{NUMBER_OF_PICKS} main numbers selected
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <button
                                                    type="button"
                                                    onClick={() => clearManualTicket(index)}
                                                    className="rounded-md border border-slate-700 px-3 py-1 font-semibold text-slate-200 transition hover:border-emerald-400"
                                                >
                                                    Clear
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeManualTicket(index)}
                                                    disabled={manualTickets.length <= 1}
                                                    className="rounded-md border border-red-500/60 px-3 py-1 font-semibold text-red-200 transition hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                                    Main numbers
                                                </p>
                                                <div className="mt-2 grid grid-cols-9 gap-2 text-xs sm:grid-cols-9">
                                                    {numberOptions.map((value) => {
                                                        const isSelected = ticket.numbers.includes(value);
                                                        const isLucky = ticket.luckyNumber === value;
                                                        const isDisabled = !isSelected && selectedCount >= NUMBER_OF_PICKS;
                                                        return (
                                                            <button
                                                                key={value}
                                                                type="button"
                                                                onClick={() => toggleMainNumber(index, value)}
                                                                disabled={isDisabled}
                                                                className={`rounded-md border px-2 py-1 font-semibold transition ${
                                                                    isLucky
                                                                        ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                                                                        : isSelected
                                                                            ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
                                                                            : 'border-slate-700 text-slate-200 hover:border-emerald-400'
                                                                } ${isDisabled ? 'cursor-not-allowed opacity-40' : ''}`}
                                                            >
                                                                {value}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                                    Lucky number
                                                </p>
                                                <div className="mt-2 grid grid-cols-9 gap-2 text-xs sm:grid-cols-9">
                                                    {numberOptions.map((value) => {
                                                        const isLucky = ticket.luckyNumber === value;
                                                        const isMain = ticket.numbers.includes(value);
                                                        return (
                                                            <button
                                                                key={value}
                                                                type="button"
                                                                onClick={() => toggleLuckyNumber(index, value)}
                                                                className={`rounded-md border px-2 py-1 font-semibold transition ${
                                                                    isLucky
                                                                        ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                                                                        : isMain
                                                                            ? 'border-emerald-400/60 text-emerald-200'
                                                                            : 'border-slate-700 text-slate-200 hover:border-amber-400'
                                                                }`}
                                                            >
                                                                {value}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                                <p>
                                    You can add up to {MAX_TICKETS_PER_PURCHASE} tickets per transaction.
                                </p>
                                <button
                                    type="button"
                                    onClick={addManualTicket}
                                    disabled={manualTickets.length >= MAX_TICKETS_PER_PURCHASE}
                                    className="rounded-md border border-emerald-400 px-3 py-1 font-semibold text-emerald-200 transition hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Add ticket
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4 space-y-5">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-300">Auto-generated numbers</h3>
                                    <p className="text-xs text-slate-500">
                                        Unique numbers 1–45 with a bonus lucky number. Choose how many tickets to auto-pick.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center">
                                    <label className="flex items-center gap-2 font-semibold text-slate-300">
                                        Tickets
                                        <select
                                            value={autoTicketCount}
                                            onChange={(event) =>
                                                handleAutoTicketCountChange(Number(event.target.value))
                                            }
                                            className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 font-semibold text-slate-100 shadow-sm transition hover:border-emerald-400 focus:border-emerald-400 focus:outline-none"
                                        >
                                            {autoTicketCountOptions.map((count) => (
                                                <option key={count} value={count}>
                                                    {count}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={regenerateAutoTickets}
                                        className="w-full rounded-md border border-emerald-400 px-3 py-1 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/10 sm:w-auto"
                                    >
                                        Regenerate batch
                                    </button>
                                </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {autoTickets.map((ticket, index) => (
                                    <div
                                        key={ticket.signature}
                                        className="group rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-emerald-400/80 hover:bg-slate-900/70"
                                    >
                                        <div className="flex items-center justify-between text-xs text-slate-400">
                                            <span className="font-semibold uppercase tracking-wide text-slate-500">
                                                Ticket {index + 1}
                                            </span>
                                            <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-200 transition group-hover:border-emerald-300 group-hover:bg-emerald-500/20">
                                                Auto pick
                                            </span>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {ticket.numbers.map((value) => (
                                                <span
                                                    key={`${ticket.signature}-${value}`}
                                                    className="rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-sm font-semibold text-emerald-200 shadow-inner shadow-emerald-500/10 transition group-hover:border-emerald-400 group-hover:bg-emerald-500/10"
                                                >
                                                    {value}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="mt-4 flex items-center gap-3 border-t border-slate-800 pt-3">
                                            <span className="text-xs uppercase tracking-wide text-amber-300/70">Lucky</span>
                                            <span className="rounded-md border border-amber-400/40 bg-amber-500/10 px-2.5 py-1 text-sm font-semibold text-amber-200 shadow-inner shadow-amber-500/20 transition group-hover:border-amber-300 group-hover:bg-amber-500/20">
                                                {ticket.luckyNumber}
                                            </span>
                                        </div>
                                    </div>
                                ))}
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
                                    : 'Buy tickets'}
                        </button>
                        {errorMessage && (
                            <p className="text-sm text-red-400">{errorMessage}</p>
                        )}
                        {status === 'success' && (
                            <div className="rounded-lg border border-emerald-600 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                                <p>
                                    {successTokenIds.length > 1
                                        ? 'Tickets purchased successfully.'
                                        : 'Ticket purchased successfully.'}
                                </p>
                                {successTokenIds.length > 0 && (
                                    <p>Token IDs: {successTokenIds.join(', ')}</p>
                                )}
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

                {latestTickets.length > 0 && (
                    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                        <h2 className="text-lg font-semibold">Latest tickets</h2>
                        <div className="mt-3 grid gap-4">
                            {latestTickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="rounded-lg border border-slate-800 bg-slate-950/60 p-4"
                                >
                                    <dl className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                                        <div>
                                            <dt className="text-slate-500">Token ID</dt>
                                            <dd className="font-medium text-slate-100">{ticket.id}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-slate-500">Round</dt>
                                            <dd className="font-medium text-slate-100">{ticket.roundId}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-slate-500">Numbers</dt>
                                            <dd className="font-medium text-slate-100">{ticket.numbers.join(', ')}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-slate-500">Lucky number</dt>
                                            <dd className="font-medium text-slate-100">{ticket.luckyNumber}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-slate-500">Mode</dt>
                                            <dd className="font-medium text-slate-100">{ticket.isAutoPick ? 'Auto' : 'Manual'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-slate-500">Claimed</dt>
                                            <dd className="font-medium text-slate-100">{ticket.claimed ? 'Yes' : 'No'}</dd>
                                        </div>
                                    </dl>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}