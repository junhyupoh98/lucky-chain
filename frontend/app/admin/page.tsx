'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { TransactionReceipt } from 'ethers';

import { useLottoContractContext } from '@/hooks/useLottoContract';

type OperationLog = {
    id: number;
    timestamp: number;
    action: string;
    status: 'success' | 'error';
    message: string;
    receipt?: TransactionReceipt;
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
    } catch (serializationError) {
        console.error('Failed to serialize error', serializationError);
        return 'Unknown error occurred.';
    }
};

const parseInteger = (value: string, label: string) => {
    if (!value || value.trim().length === 0) {
        throw new Error(`${label} is required.`);
    }

    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || Number.isNaN(parsed)) {
        throw new Error(`${label} must be a number.`);
    }

    return parsed;
};

export default function AdminPage() {
    const {
        address,
        ownerAddress,
        allowedAdminAddresses,
        connectWallet,
        isConnecting,
        isWalletAvailable,
        isWrongNetwork,
        switchToExpectedNetwork,
        expectedChainId,
        pendingTransaction,
        isAuthorizedOperator,
        currentDrawId,
        createOrUpdateDraw,
        setCurrentDraw,
        requestRandomWinningNumbers,
    } = useLottoContractContext();

    const [createForm, setCreateForm] = useState({
        drawId: '',
        drawTimestamp: '',
        isOpenForSale: true,
    });
    const [currentDrawInput, setCurrentDrawInput] = useState('');
    const [requestDrawInput, setRequestDrawInput] = useState('');
    const [logs, setLogs] = useState<OperationLog[]>([]);
    const [localPendingAction, setLocalPendingAction] = useState<string | null>(null);

    const isBusy = localPendingAction !== null;

    const allowlistedAddresses = useMemo(
        () => allowedAdminAddresses.map((admin) => admin.toLowerCase()),
        [allowedAdminAddresses],
    );

    const appendLog = (entry: Omit<OperationLog, 'id' | 'timestamp'>) => {
        const timestamp = Date.now();
        setLogs((previous) => [
            ...previous,
            {
                ...entry,
                id: timestamp + Math.random(),
                timestamp,
            },
        ]);
    };

    const handleCreateOrUpdate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setLocalPendingAction('create');
            const drawId = parseInteger(createForm.drawId, 'Draw ID');
            const drawTimestamp = parseInteger(createForm.drawTimestamp, 'Draw timestamp');

            const receipt = await createOrUpdateDraw(drawId, drawTimestamp, createForm.isOpenForSale);
            appendLog({
                action: 'createOrUpdateDraw',
                status: 'success',
                message: `Draw ${drawId} scheduled for ${new Date(drawTimestamp * 1000).toLocaleString()}.`,
                receipt,
            });
        } catch (error) {
            appendLog({
                action: 'createOrUpdateDraw',
                status: 'error',
                message: extractErrorMessage(error),
            });
        } finally {
            setLocalPendingAction(null);
        }
    };

    const handleSetCurrentDraw = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setLocalPendingAction('setCurrent');
            const drawId = parseInteger(currentDrawInput, 'Current draw ID');
            const receipt = await setCurrentDraw(drawId);
            appendLog({
                action: 'setCurrentDraw',
                status: 'success',
                message: `Current draw updated to #${drawId}.`,
                receipt,
            });
            setCurrentDrawInput('');
        } catch (error) {
            appendLog({
                action: 'setCurrentDraw',
                status: 'error',
                message: extractErrorMessage(error),
            });
        } finally {
            setLocalPendingAction(null);
        }
    };

    const handleRequestRandomness = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setLocalPendingAction('requestRandomness');
            const drawId = parseInteger(requestDrawInput, 'Draw ID for randomness');
            const receipt = await requestRandomWinningNumbers(drawId);
            appendLog({
                action: 'requestRandomWinningNumbers',
                status: 'success',
                message: `Random winning numbers requested for draw #${drawId}.`,
                receipt,
            });
            setRequestDrawInput('');
        } catch (error) {
            appendLog({
                action: 'requestRandomWinningNumbers',
                status: 'error',
                message: extractErrorMessage(error),
            });
        } finally {
            setLocalPendingAction(null);
        }
    };

    const formattedCreateTimestamp = useMemo(() => {
        if (!createForm.drawTimestamp) {
            return '—';
        }

        const timestampNumber = Number.parseInt(createForm.drawTimestamp, 10);
        if (!Number.isFinite(timestampNumber)) {
            return '—';
        }

        return new Date(timestampNumber * 1000).toLocaleString();
    }, [createForm.drawTimestamp]);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10">
                <header className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-3xl font-semibold">Draw Operations Console</h1>
                        <Link
                            href="/"
                            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
                        >
                            ← Back to app
                        </Link>
                    </div>
                    <p className="text-sm text-slate-300">
                        Manage draw lifecycle actions for the Lucky Chain lottery. Only allowlisted wallets or the contract
                        owner can trigger these operations.
                    </p>
                </header>

                <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                    <h2 className="text-lg font-semibold">Wallet status</h2>
                    <div className="mt-4 flex flex-col gap-3 text-sm text-slate-300">
                        {!isWalletAvailable ? (
                            <p>
                                Install a compatible Ethereum wallet (such as Kaia Kaikas or MetaMask) to manage draws from this
                                console.
                            </p>
                        ) : address ? (
                            <>
                                <p>
                                    <span className="font-medium text-slate-100">Connected wallet:</span> {formatAddress(address)}
                                </p>
                                <p>
                                    <span className="font-medium text-slate-100">Authorized:</span>{' '}
                                    {isAuthorizedOperator ? (
                                        <span className="text-emerald-400">Yes</span>
                                    ) : (
                                        <span className="text-rose-400">No</span>
                                    )}
                                </p>
                                <p>
                                    <span className="font-medium text-slate-100">Current draw ID on chain:</span>{' '}
                                    {currentDrawId !== null ? currentDrawId.toString() : '—'}
                                </p>
                                {pendingTransaction && (
                                    <p className="break-all text-xs text-slate-400">
                                        <span className="font-medium text-slate-200">Pending transaction:</span> {pendingTransaction}
                                    </p>
                                )}
                                {isWrongNetwork && (
                                    <button
                                        onClick={() => switchToExpectedNetwork()}
                                        className="mt-3 w-fit rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-400"
                                    >
                                        Switch to chain #{expectedChainId}
                                    </button>
                                )}
                            </>
                        ) : (
                            <button
                                onClick={() => connectWallet()}
                                disabled={isConnecting}
                                className="w-fit rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-sky-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isConnecting ? 'Connecting…' : 'Connect wallet'}
                            </button>
                        )}
                        {address && !isAuthorizedOperator && (
                            <div className="mt-4 space-y-2 rounded-lg border border-rose-700/70 bg-rose-950/40 p-4 text-xs text-rose-200">
                                <p className="font-semibold text-rose-100">Wallet is not authorized to manage draws.</p>
                                <p>Owner address: {formatAddress(ownerAddress)}</p>
                                {allowlistedAddresses.length > 0 ? (
                                    <p>
                                        Allowlist: {allowlistedAddresses.map((admin) => formatAddress(admin)).join(', ')}
                                    </p>
                                ) : (
                                    <p>No additional allowlisted addresses are configured.</p>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {address && !isWrongNetwork && isAuthorizedOperator && (
                    <div className="flex flex-col gap-6">
                        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                            <h2 className="text-lg font-semibold">Create or update draw</h2>
                            <p className="mt-1 text-sm text-slate-300">
                                Provide the draw ID and the scheduled draw timestamp (in seconds). These checks match the Foundry
                                scripts used for manual draw creation.
                            </p>
                            <form onSubmit={handleCreateOrUpdate} className="mt-4 grid gap-4 md:grid-cols-2">
                                <label className="flex flex-col gap-1 text-sm">
                                    <span className="font-medium text-slate-100">Draw ID</span>
                                    <input
                                        type="number"
                                        min={0}
                                        step={1}
                                        required
                                        value={createForm.drawId}
                                        onChange={(event) =>
                                            setCreateForm((previous) => ({
                                                ...previous,
                                                drawId: event.target.value,
                                            }))
                                        }
                                        className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-sky-500"
                                    />
                                </label>
                                <label className="flex flex-col gap-1 text-sm">
                                    <span className="font-medium text-slate-100">Draw timestamp (seconds)</span>
                                    <input
                                        type="number"
                                        min={0}
                                        required
                                        value={createForm.drawTimestamp}
                                        onChange={(event) =>
                                            setCreateForm((previous) => ({
                                                ...previous,
                                                drawTimestamp: event.target.value,
                                            }))
                                        }
                                        className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-sky-500"
                                    />
                                    <span className="text-xs text-slate-400">
                                        Local time: {formattedCreateTimestamp}
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 text-sm md:col-span-2">
                                    <input
                                        type="checkbox"
                                        checked={createForm.isOpenForSale}
                                        onChange={(event) =>
                                            setCreateForm((previous) => ({
                                                ...previous,
                                                isOpenForSale: event.target.checked,
                                            }))
                                        }
                                        className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                                    />
                                    <span>Open tickets for sale immediately</span>
                                </label>
                                <div className="md:col-span-2">
                                    <button
                                        type="submit"
                                        disabled={isBusy}
                                        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isBusy && localPendingAction === 'create' ? 'Submitting…' : 'Create / Update draw'}
                                    </button>
                                </div>
                            </form>
                        </section>

                        <section className="grid gap-6 md:grid-cols-2">
                            <form
                                onSubmit={handleSetCurrentDraw}
                                className="rounded-xl border border-slate-800 bg-slate-900/60 p-6"
                            >
                                <h2 className="text-lg font-semibold">Set current draw</h2>
                                <p className="mt-1 text-sm text-slate-300">
                                    Update the draw that tickets will mint into. The ID must already exist.
                                </p>
                                <label className="mt-3 flex flex-col gap-1 text-sm">
                                    <span className="font-medium text-slate-100">Draw ID</span>
                                    <input
                                        type="number"
                                        min={0}
                                        step={1}
                                        required
                                        value={currentDrawInput}
                                        onChange={(event) => setCurrentDrawInput(event.target.value)}
                                        className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-sky-500"
                                    />
                                </label>
                                <button
                                    type="submit"
                                    disabled={isBusy}
                                    className="mt-4 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-indigo-950 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isBusy && localPendingAction === 'setCurrent'
                                        ? 'Updating…'
                                        : 'Set current draw'}
                                </button>
                            </form>

                            <form
                                onSubmit={handleRequestRandomness}
                                className="rounded-xl border border-slate-800 bg-slate-900/60 p-6"
                            >
                                <h2 className="text-lg font-semibold">Request random winning numbers</h2>
                                <p className="mt-1 text-sm text-slate-300">
                                    Request VRF randomness for a completed draw. The draw ID must be lower than the current draw.
                                </p>
                                <label className="mt-3 flex flex-col gap-1 text-sm">
                                    <span className="font-medium text-slate-100">Draw ID</span>
                                    <input
                                        type="number"
                                        min={0}
                                        step={1}
                                        required
                                        value={requestDrawInput}
                                        onChange={(event) => setRequestDrawInput(event.target.value)}
                                        className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-sky-500"
                                    />
                                </label>
                                <button
                                    type="submit"
                                    disabled={isBusy}
                                    className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isBusy && localPendingAction === 'requestRandomness'
                                        ? 'Requesting…'
                                        : 'Request randomness'}
                                </button>
                            </form>
                        </section>
                    </div>
                )}

                <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                    <h2 className="text-lg font-semibold">Transaction log</h2>
                    {logs.length === 0 ? (
                        <p className="mt-2 text-sm text-slate-300">Actions and receipts will appear here.</p>
                    ) : (
                        <ul className="mt-4 space-y-4 text-sm text-slate-200">
                            {logs
                                .slice()
                                .reverse()
                                .map((log) => (
                                    <li
                                        key={log.id}
                                        className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/60 p-4"
                                    >
                                        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                                            <span>•</span>
                                            <span>{log.action}</span>
                                            <span>•</span>
                                            <span
                                                className={
                                                    log.status === 'success' ? 'text-emerald-400' : 'text-rose-400'
                                                }
                                            >
                                                {log.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-100">{log.message}</p>
                                        {log.receipt && (
                                            <div className="space-y-1 text-xs text-slate-400">
                                                <p>
                                                    <span className="font-medium text-slate-200">Tx hash:</span>{' '}
                                                    <span className="break-all">{log.receipt.hash}</span>
                                                </p>
                                                <p>
                                                    <span className="font-medium text-slate-200">Status:</span>{' '}
                                                    {log.receipt.status === 1 ? 'Success' : 'Failed'}
                                                </p>
                                                <p>
                                                    <span className="font-medium text-slate-200">Block:</span>{' '}
                                                    {log.receipt.blockNumber}
                                                </p>
                                                <p>
                                                    <span className="font-medium text-slate-200">Gas used:</span>{' '}
                                                    {log.receipt.gasUsed.toString()}
                                                </p>
                                            </div>
                                        )}
                                    </li>
                                ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}