'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { formatEther } from 'ethers';

import { useLottoContractContext, type RoundInfo } from '@/hooks/useLottoContract';

type OperationLog = {
    id: number;
    timestamp: number;
    action: string;
    status: 'success' | 'error';
    message: string;
};

const formatAddress = (address: string | null | undefined) => {
    if (!address) {
        return '—';
    }

    return `${address.slice(0, 6)}…${address.slice(-4)}`;
};

const extractErrorMessage = (error: unknown) => {
    if (error instanceof Error && typeof error.message === 'string') {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    try {
        return JSON.stringify(error);
    } catch {
        return 'Unknown error occurred.';
    }
};

const phaseLabels: Record<string, string> = {
    sales: 'Ticket Sales',
    drawing: 'Drawing',
    claimable: 'Claimable',
};

function formatKaia(value: bigint | null | undefined) {
    if (!value) {
        return '—';
    }
    try {
        return `${formatEther(value)} KAIA`;
    } catch {
        return value.toString();
    }
}

export default function AdminPage() {
    const {
        provider,
        address,
        ownerAddress,
        allowedAdminAddresses,
        connectWallet,
        disconnectWallet,
        isConnecting,
        isWalletAvailable,
        isWrongNetwork,
        switchToExpectedNetwork,
        expectedChainId,
        pendingTransaction,
        isAuthorizedOperator,
        currentRoundId,
        getActiveRound,
        getRoundInfo,
        closeCurrentRound,
        startNextRound,
        requestRandomWinningNumbers,
        finalizePayouts,
    } = useLottoContractContext();

    const [roundInfo, setRoundInfo] = useState<RoundInfo | null>(null);
    const [logs, setLogs] = useState<OperationLog[]>([]);
    const [requestRound, setRequestRound] = useState('');
    const [finalizeRound, setFinalizeRound] = useState('');
    const [nextRoundStart, setNextRoundStart] = useState('');
    const [isLoadingRound, setIsLoadingRound] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const normalizedAdmins = useMemo(
        () => allowedAdminAddresses.map((value) => value.toLowerCase()),
        [allowedAdminAddresses],
    );

    const appendLog = (entry: Omit<OperationLog, 'id' | 'timestamp'>) => {
        const timestamp = Date.now();
        setLogs((previous) => [
            {
                ...entry,
                id: timestamp + Math.random(),
                timestamp,
            },
            ...previous,
        ]);
    };

    const refreshRound = useCallback(() => {
        setIsLoadingRound(true);
        void (async () => {
            try {
                const info = await getActiveRound();
                setRoundInfo(info);
            } finally {
                setIsLoadingRound(false);
            }
        })();
    }, [getActiveRound]);

    useEffect(() => {
        if (!isWrongNetwork) {
            refreshRound();
        }
    }, [isWrongNetwork, refreshRound]);

    useEffect(() => {
        if (!toastMessage) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setToastMessage(null);
        }, 4000);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [toastMessage]);

    const handleConnectWallet = async () => {
        try {
            setToastMessage(null);
            await connectWallet();
        } catch (error) {
            console.error('Failed to connect wallet', error);
            setToastMessage(extractErrorMessage(error));
        }
    };

    const handleDisconnectWallet = async () => {
        try {
            setToastMessage(null);
            await disconnectWallet();
        } catch (error) {
            console.error('Failed to disconnect wallet', error);
            setToastMessage(extractErrorMessage(error));
        }
    };

    const handleCloseRound = async () => {
        try {
            appendLog({ action: 'closeCurrentRound', status: 'success', message: 'Closing round…' });
            const receipt = await closeCurrentRound();
            appendLog({
                action: 'closeCurrentRound',
                status: 'success',
                message: receipt ? `Closed round in tx ${receipt.hash}` : 'Round closed.',
            });
            refreshRound();
        } catch (error) {
            appendLog({
                action: 'closeCurrentRound',
                status: 'error',
                message: extractErrorMessage(error),
            });
        }
    };

    const handleStartNextRound = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const label = nextRoundStart.trim().length > 0
            ? `Start next round at ${nextRoundStart}`
            : 'Start next round now';

        try {
            appendLog({ action: 'startNextRound', status: 'success', message: `${label}…` });
            const timestamp = nextRoundStart.trim().length > 0
                ? Number.parseInt(nextRoundStart.trim(), 10)
                : undefined;
            const receipt = await startNextRound(timestamp);
            appendLog({
                action: 'startNextRound',
                status: 'success',
                message: receipt ? `Started new round in tx ${receipt.hash}` : 'Started new round.',
            });
            setNextRoundStart('');
            refreshRound();
        } catch (error) {
            appendLog({
                action: 'startNextRound',
                status: 'error',
                message: extractErrorMessage(error),
            });
        }
    };

    const handleRequestRandomness = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const roundValue = Number.parseInt(requestRound.trim(), 10);
            if (Number.isNaN(roundValue)) {
                throw new Error('Round ID must be a number.');
            }
            appendLog({ action: 'requestRandom', status: 'success', message: `Requesting VRF for round #${roundValue}…` });
            const receipt = await requestRandomWinningNumbers(roundValue);
            appendLog({
                action: 'requestRandom',
                status: 'success',
                message: receipt ? `Randomness requested (tx ${receipt.hash}).` : 'Randomness requested.',
            });
            setRequestRound('');
        } catch (error) {
            appendLog({
                action: 'requestRandom',
                status: 'error',
                message: extractErrorMessage(error),
            });
        }
    };

    const handleFinalizePayouts = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const roundValue = Number.parseInt(finalizeRound.trim(), 10);
            if (Number.isNaN(roundValue)) {
                throw new Error('Round ID must be a number.');
            }
            appendLog({ action: 'finalizePayouts', status: 'success', message: `Finalizing payouts for round #${roundValue}…` });
            const receipt = await finalizePayouts(roundValue);
            appendLog({
                action: 'finalizePayouts',
                status: 'success',
                message: receipt ? `Payouts finalized (tx ${receipt.hash}).` : 'Payouts finalized.',
            });
            setFinalizeRound('');
            refreshRound();
        } catch (error) {
            appendLog({
                action: 'finalizePayouts',
                status: 'error',
                message: extractErrorMessage(error),
            });
        }
    };

    const reloadRoundDetails = async (roundId: bigint) => {
        const info = await getRoundInfo(roundId);
        if (info) {
            setRoundInfo(info);
        }
    };

    useEffect(() => {
        if (currentRoundId !== null && !isWrongNetwork) {
            void reloadRoundDetails(currentRoundId);
        }
    }, [currentRoundId, getRoundInfo, isWrongNetwork]);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-12">
                <header className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold">Lucky Chain Admin Console</h1>
                    <p className="text-sm text-slate-400">
                        Manage weekly rounds, trigger randomness, and settle payouts for the Lucky Chain lottery.
                    </p>
                </header>

                <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                    <h2 className="text-lg font-semibold">Wallet</h2>
                    <div className="mt-3 flex flex-col gap-2 text-sm text-slate-300">
                        <div>
                            <span className="font-medium text-slate-200">Connected wallet:</span>{' '}
                            {formatAddress(address)}
                        </div>
                        <div>
                            <span className="font-medium text-slate-200">Owner:</span>{' '}
                            {formatAddress(ownerAddress)}
                        </div>
                        <div>
                            <span className="font-medium text-slate-200">Authorized admins:</span>{' '}
                            {normalizedAdmins.length > 0 ? normalizedAdmins.join(', ') : '—'}
                        </div>
                        <div>
                            <span className="font-medium text-slate-200">Network status:</span>{' '}
                            {isWrongNetwork ? `Wrong network (expected chain ID ${expectedChainId})` : 'Ready'}
                        </div>
                        <div>
                            <span className="font-medium text-slate-200">Pending tx:</span>{' '}
                            {pendingTransaction ?? '—'}
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                        {!isWalletAvailable && (
                            <p className="text-sm text-red-400">No EVM wallet detected in this browser.</p>
                        )}
                        <button
                            type="button"
                            onClick={() => void handleConnectWallet()}
                            disabled={isConnecting || !provider}
                            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isConnecting ? 'Connecting…' : 'Connect wallet'}
                        </button>
                        <button
                            type="button"
                            onClick={() => void handleDisconnectWallet()}
                            disabled={!address}
                            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-red-400 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Disconnect
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
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Active round</h2>
                        <button
                            type="button"
                            onClick={refreshRound}
                            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                        >
                            Refresh
                        </button>
                    </div>
                    <div className="mt-3 text-sm text-slate-300">
                        {isLoadingRound && <p>Loading round information…</p>}
                        {!isLoadingRound && roundInfo && (
                            <dl className="grid gap-2 sm:grid-cols-2">
                                <div>
                                    <dt className="text-slate-500">Round ID</dt>
                                    <dd className="font-medium text-slate-100">{roundInfo.id.toString()}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">Phase</dt>
                                    <dd className="font-medium text-slate-100">{phaseLabels[roundInfo.phase]}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">Ticket count</dt>
                                    <dd className="font-medium text-slate-100">{roundInfo.ticketCount.toString()}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">Gross sales</dt>
                                    <dd className="font-medium text-slate-100">{formatKaia(roundInfo.gross)}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">Carry in</dt>
                                    <dd className="font-medium text-slate-100">{formatKaia(roundInfo.carryIn)}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">Carry out</dt>
                                    <dd className="font-medium text-slate-100">{formatKaia(roundInfo.carryOut)}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">Winning numbers</dt>
                                    <dd className="font-medium text-slate-100">
                                        {roundInfo.winningNumbers.length > 0
                                            ? `${roundInfo.winningNumbers.join(', ')} | Lucky ${roundInfo.luckyNumber ?? '—'}`
                                            : '—'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">Payouts finalized</dt>
                                    <dd className="font-medium text-slate-100">{roundInfo.payoutsFinalized ? 'Yes' : 'No'}</dd>
                                </div>
                            </dl>
                        )}
                        {!isLoadingRound && !roundInfo && (
                            <p>No active round information available.</p>
                        )}
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                        <h3 className="text-lg font-semibold">Close round</h3>
                        <p className="mt-2 text-sm text-slate-400">
                            Ends ticket sales for the current round. Requires the round sales window to have elapsed.
                        </p>
                        <button
                            type="button"
                            onClick={handleCloseRound}
                            disabled={!isAuthorizedOperator}
                            className="mt-4 w-full rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-red-950 transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Close current round
                        </button>
                    </div>

                    <form
                        className="rounded-xl border border-slate-800 bg-slate-900/60 p-6"
                        onSubmit={handleStartNextRound}
                    >
                        <h3 className="text-lg font-semibold">Start next round</h3>
                        <p className="mt-2 text-sm text-slate-400">
                            Optionally specify a Unix timestamp for the new round start. Leave blank to open immediately.
                        </p>
                        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Start timestamp (seconds)
                        </label>
                        <input
                            value={nextRoundStart}
                            onChange={(event) => setNextRoundStart(event.target.value)}
                            placeholder="Now"
                            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!isAuthorizedOperator}
                            className="mt-4 w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Start next round
                        </button>
                    </form>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                    <form
                        className="rounded-xl border border-slate-800 bg-slate-900/60 p-6"
                        onSubmit={handleRequestRandomness}
                    >
                        <h3 className="text-lg font-semibold">Request winning numbers</h3>
                        <p className="mt-2 text-sm text-slate-400">
                            Request Chainlink VRF randomness for a completed round (must be in the Drawing phase).
                        </p>
                        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Round ID
                        </label>
                        <input
                            value={requestRound}
                            onChange={(event) => setRequestRound(event.target.value)}
                            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!isAuthorizedOperator}
                            className="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-blue-950 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Request randomness
                        </button>
                    </form>

                    <form
                        className="rounded-xl border border-slate-800 bg-slate-900/60 p-6"
                        onSubmit={handleFinalizePayouts}
                    >
                        <h3 className="text-lg font-semibold">Finalize payouts</h3>
                        <p className="mt-2 text-sm text-slate-400">
                            Calculates tier prizes and moves carry-over after winning numbers are set.
                        </p>
                        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Round ID
                        </label>
                        <input
                            value={finalizeRound}
                            onChange={(event) => setFinalizeRound(event.target.value)}
                            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!isAuthorizedOperator}
                            className="mt-4 w-full rounded-lg bg-purple-500 px-4 py-2 text-sm font-semibold text-purple-950 transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Finalize payouts
                        </button>
                    </form>
                </section>

                <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                    <h3 className="text-lg font-semibold">Activity log</h3>
                    <div className="mt-3 space-y-3 text-sm text-slate-300">
                        {logs.length === 0 && <p>No administrative actions recorded yet.</p>}
                        {logs.map((log) => (
                            <div key={log.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                                    <span className={log.status === 'success' ? 'text-emerald-400' : 'text-red-400'}>
                                        {log.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="mt-1 font-semibold text-slate-200">{log.action}</div>
                                <div className="text-slate-300">{log.message}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            {toastMessage && (
                <div className="pointer-events-none fixed right-4 top-4 z-50 max-w-xs rounded-lg border border-red-500/40 bg-red-500/20 px-4 py-3 text-sm text-red-100 shadow-lg">
                    {toastMessage}
                </div>
            )}
        </main>
    );
}