"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Interface, ZeroAddress, formatEther } from "ethers";

import lottoAbi from "../../lib/abi.json";
import { useLottoContractContext } from "@/hooks/useLottoContract";
import type { TicketData } from "@/hooks/useLottoContract";

const NUMBER_OF_PICKS = 6;
const MIN_NUMBER = 1;
const MAX_NUMBER = 45;
const MAX_TICKETS_PER_PURCHASE = 50;

const AUTO_DEFAULT_COUNT = 5;

type SubmissionStatus = "idle" | "uploading" | "minting" | "success" | "error";
type EntryMode = "manual" | "auto";

type ManualTicketDraft = {
    id: string;
    numbers: number[];
    luckyNumber: number | null;
};

type AutoTicketDraft = {
    id: string;
    numbers: number[];
    luckyNumber: number;
    signature: string;
};

const createRandomId = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
};

const createManualDraft = (): ManualTicketDraft => ({
    id: createRandomId(),
    numbers: [],
    luckyNumber: null,
});

const makeSignature = (numbers: number[], luckyNumber: number) =>
    `${numbers.join("-")}|${luckyNumber}`;

function generateAutoTicket(existing: Set<string>): AutoTicketDraft {
    const chosen = new Set<number>();

    while (chosen.size < NUMBER_OF_PICKS) {
        const value = Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
        chosen.add(value);
    }

    const numbers = Array.from(chosen).sort((a, b) => a - b);

    let luckyNumber = Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
    while (chosen.has(luckyNumber)) {
        luckyNumber = Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
    }

    const signature = makeSignature(numbers, luckyNumber);
    if (existing.has(signature)) {
        return generateAutoTicket(existing);
    }

    existing.add(signature);

    return {
        id: createRandomId(),
        numbers,
        luckyNumber,
        signature,
    };
}

const generateAutoBatch = (count: number): AutoTicketDraft[] => {
    const safeCount = Math.min(Math.max(Math.trunc(count) || 1, 1), MAX_TICKETS_PER_PURCHASE);
    const seen = new Set<string>();
    const tickets: AutoTicketDraft[] = [];

    while (tickets.length < safeCount) {
        tickets.push(generateAutoTicket(seen));
    }

    return tickets;
};

const extractErrorMessage = (error: unknown) => {
    if (error instanceof Error && typeof error.message === "string") {
        return error.message;
    }

    if (typeof error === "string") {
        return error;
    }

    try {
        return JSON.stringify(error);
    } catch {
        return "An unexpected error occurred.";
    }
};

const describePhase = (phase?: string) => {
    switch (phase) {
        case "sales":
            return "Ticket sales";
        case "drawing":
            return "Drawing";
        case "claimable":
            return "Claimable";
        default:
            return phase ?? "—";
    }
};

function ManualNumberButton({
    value,
    isSelected,
    isLucky,
    disabled,
    onClick,
}: {
    value: number;
    isSelected: boolean;
    isLucky: boolean;
    disabled?: boolean;
    onClick: () => void;
}) {
    const base =
        "rounded-md border px-2 py-1 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400";
    const variant = isLucky
        ? "border-amber-400 bg-amber-500/20 text-amber-200"
        : isSelected
            ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
            : "border-slate-700 text-slate-200 hover:border-emerald-400";
    const state = disabled ? "cursor-not-allowed opacity-40" : "";

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variant} ${state}`.trim()}
        >
            {value}
        </button>
    );
}

function LuckyNumberButton({
    value,
    isLucky,
    isMain,
    onClick,
}: {
    value: number;
    isLucky: boolean;
    isMain: boolean;
    onClick: () => void;
}) {
    const base =
        "rounded-md border px-2 py-1 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-400";
    const variant = isLucky
        ? "border-amber-400 bg-amber-500/20 text-amber-200"
        : isMain
            ? "border-emerald-400/60 text-emerald-200"
            : "border-slate-700 text-slate-200 hover:border-amber-400";

    return (
        <button type="button" onClick={onClick} className={`${base} ${variant}`.trim()}>
            {value}
        </button>
    );
}

export default function Home() {
    const {
        provider,
        address,
        expectedChainId,
        chainId,
        connectWallet,
        disconnectWallet,
        isConnecting,
        isWrongNetwork,
        switchToExpectedNetwork,
        getActiveRound,
        buyTickets,
        isWalletAvailable,
        getTicketData,
        uploadMetadata,
        pendingTransaction,
        ticketPrice,
    } = useLottoContractContext();

    const [entryMode, setEntryMode] = useState<EntryMode>("manual");
    const [manualTickets, setManualTickets] = useState<ManualTicketDraft[]>([createManualDraft()]);
    const [autoTickets, setAutoTickets] = useState<AutoTicketDraft[]>(() =>
        generateAutoBatch(AUTO_DEFAULT_COUNT),
    );
    const [autoCount, setAutoCount] = useState<number>(AUTO_DEFAULT_COUNT);

    const [status, setStatus] = useState<SubmissionStatus>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [transactionHash, setTransactionHash] = useState<string | null>(null);
    const [successTokenIds, setSuccessTokenIds] = useState<string[]>([]);
    const [latestTickets, setLatestTickets] = useState<TicketData[]>([]);
    const [activeRoundId, setActiveRoundId] = useState<number>();
    const [activePhase, setActivePhase] = useState<string>();
    const [autoSeed, setAutoSeed] = useState<number>(Date.now());
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const currentTicketCount = entryMode === "manual" ? manualTickets.length : autoTickets.length;
    const totalCost = useMemo(() => {
        if (!ticketPrice) {
            return null;
        }

        try {
            return Number(ticketPrice) * currentTicketCount;
        } catch (error) {
            console.error("Failed to compute total cost", error);
            return null;
        }
    }, [ticketPrice, currentTicketCount]);

    useEffect(() => {
        const loadRoundInfo = async () => {
            try {
                const round = await getActiveRound();
                if (round) {
                    setActiveRoundId(Number(round.id));
                    setActivePhase(round.phase);
                }
            } catch (error) {
                console.error("Failed to load round info", error);
            }
        };

        void loadRoundInfo();
    }, [getActiveRound]);

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

    useEffect(() => {
        setAutoTickets(generateAutoBatch(autoCount));
    }, [autoSeed, autoCount]);

    const toggleManualNumber = (ticketId: string, value: number) => {
        setManualTickets((drafts) =>
            drafts.map((draft) => {
                if (draft.id !== ticketId) return draft;
                const alreadySelected = draft.numbers.includes(value);

                if (alreadySelected) {
                    return { ...draft, numbers: draft.numbers.filter((n) => n !== value) };
                }

                if (draft.numbers.length >= NUMBER_OF_PICKS) {
                    return draft;
                }

                return {
                    ...draft,
                    numbers: [...draft.numbers, value].sort((a, b) => a - b),
                };
            }),
        );
    };

    const setManualLuckyNumber = (ticketId: string, value: number) => {
        setManualTickets((drafts) =>
            drafts.map((draft) => {
                if (draft.id !== ticketId) return draft;
                return { ...draft, luckyNumber: draft.luckyNumber === value ? null : value };
            }),
        );
    };

    const addManualTicket = () => {
        setManualTickets((drafts) => {
            if (drafts.length >= MAX_TICKETS_PER_PURCHASE) {
                return drafts;
            }
            return [...drafts, createManualDraft()];
        });
    };

    const removeManualTicket = (ticketId: string) => {
        setManualTickets((drafts) => {
            if (drafts.length <= 1) {
                return drafts;
            }
            return drafts.filter((draft) => draft.id !== ticketId);
        });
    };

    const resetAutoTickets = () => {
        setAutoSeed(Date.now());
    };

    const isManualTicketValid = (ticket: ManualTicketDraft) => {
        if (ticket.numbers.length !== NUMBER_OF_PICKS) {
            return false;
        }
        if (ticket.luckyNumber == null) {
            return false;
        }
        return true;
    };

    const manualTicketErrors = useMemo(() => {
        const errors = new Map<string, string>();

        manualTickets.forEach((ticket, index) => {
            if (!isManualTicketValid(ticket)) {
                errors.set(ticket.id, "Complete all numbers and lucky number");
                return;
            }

            const numbersSet = new Set(ticket.numbers);
            if (numbersSet.size !== ticket.numbers.length) {
                errors.set(ticket.id, "Numbers must be unique");
            }

            if (numbersSet.has(ticket.luckyNumber!)) {
                errors.set(ticket.id, "Lucky number must differ from main numbers");
            }

            for (let i = 0; i < manualTickets.length; i++) {
                if (i === index) continue;
                const other = manualTickets[i];
                if (!isManualTicketValid(other)) continue;

                if (makeSignature(other.numbers, other.luckyNumber!).includes(ticket.id)) {
                    continue;
                }

                const sameNumbers =
                    other.numbers.length === ticket.numbers.length &&
                    other.numbers.every((value, idx) => value === ticket.numbers[idx]);
                const sameLucky = other.luckyNumber === ticket.luckyNumber;

                if (sameNumbers && sameLucky) {
                    errors.set(ticket.id, "Duplicate ticket detected");
                }
            }
        });

        return errors;
    }, [manualTickets]);

    const hasManualErrors = manualTickets.some((ticket) => manualTicketErrors.has(ticket.id));

    const totalPriceDisplay = useMemo(() => {
        if (!ticketPrice) {
            return "—";
        }
        if (!totalCost) {
            return "—";
        }
        return `${totalCost} KAIA`;
    }, [ticketPrice, totalCost]);

    const handleConnectWallet = async () => {
        try {
            setToastMessage(null);
            await connectWallet();
        } catch (error) {
            console.error("Failed to connect wallet", error);
            setToastMessage(extractErrorMessage(error));
        }
    };

    const handleDisconnectWallet = async () => {
        try {
            setToastMessage(null);
            await disconnectWallet();
        } catch (error) {
            console.error("Failed to disconnect wallet", error);
            setToastMessage(extractErrorMessage(error));
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!address) {
            setErrorMessage("Connect your wallet to purchase tickets.");
            return;
        }

        if (entryMode === "manual" && hasManualErrors) {
            setErrorMessage("Resolve highlighted ticket errors before submitting.");
            return;
        }

        try {
            setStatus("uploading");
            setErrorMessage(null);
            setTransactionHash(null);
            setSuccessTokenIds([]);

            const ticketsToPurchase =
                entryMode === "manual"
                    ? manualTickets.map((ticket) => ({
                        numbers: ticket.numbers,
                        luckyNumber: ticket.luckyNumber!,
                        isAutoPick: false,
                    }))
                    : autoTickets.map((ticket) => ({
                        numbers: ticket.numbers,
                        luckyNumber: ticket.luckyNumber,
                        isAutoPick: true,
                    }));

            const metadataPayloads = ticketsToPurchase.map((ticket) => ({
                numbers: ticket.numbers,
                luckyNumber: ticket.luckyNumber,
                address,
                isAutoPick: ticket.isAutoPick,
            }));

            const metadataResults = await uploadMetadata(metadataPayloads);

            if (!metadataResults.every((result) => result.success && result.uri)) {
                throw new Error("Metadata upload failed for one or more tickets.");
            }

            setStatus("minting");

            const ticketsWithMetadata = ticketsToPurchase.map((ticket, index) => ({
                numbers: ticket.numbers,
                luckyNumber: ticket.luckyNumber,
                isAutoPick: ticket.isAutoPick,
                tokenURI: metadataResults[index]?.uri!,
            }));

            const receipt = await buyTickets(ticketsWithMetadata);

            if (receipt) {
                setTransactionHash(receipt.hash);
                const iface = new Interface(lottoAbi);

                const ticketIds: string[] = [];

                for (const log of receipt.logs ?? []) {
                    try {
                        const parsed = iface.parseLog(log);
                        if (parsed?.name === "TicketPurchased") {
                            const tokenId = parsed.args?.tokenId;
                            if (tokenId != null) {
                                ticketIds.push(tokenId.toString());
                            }
                        }
                    } catch (error) {
                        console.error("Failed to parse log", error);
                    }
                }

                setSuccessTokenIds(ticketIds);

                if (entryMode === "auto") {
                    resetAutoTickets();
                }

                const fetched = await Promise.all(
                    ticketIds.map(async (tokenId) => {
                        try {
                            return await getTicketData(BigInt(tokenId));
                        } catch (error) {
                            console.error("Failed to load minted ticket", error);
                            return null;
                        }
                    }),
                );

                setLatestTickets(fetched.filter((ticket): ticket is TicketData => Boolean(ticket)));
            }
        } catch (error) {
            console.error("Ticket purchase failed", error);
            setStatus("error");
            setErrorMessage(error instanceof Error ? error.message : "Ticket purchase failed.");
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-12">
                <header className="flex flex-col gap-2">
                    <h1 className="text-4xl font-semibold">Lucky Chain Lottery</h1>
                    <p className="text-sm text-slate-400">
                        Purchase weekly NFT tickets with six numbers and a lucky bonus number. Choose your own picks or let the
system
                        generate a random ticket for you.
                    </p>
                </header>

                <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                    <h2 className="text-lg font-semibold">Wallet status</h2>
                    <div className="mt-3 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
                        <div>
                            <span className="font-medium text-slate-200">Address:</span>{" "}
                            {address ?? "Not connected"}
                        </div>
                        <div>
                            <span className="font-medium text-slate-200">Network:</span>{" "}
                            {isWrongNetwork
                                ? `Wrong network (expected ${expectedChainId}, current ${chainId ?? "unknown"})`
                                : "Ready"}
                        </div>
                        <div>
                            <span className="font-medium text-slate-200">Ticket price:</span>{" "}
                            {ticketPrice ? `${ticketPrice} KAIA` : "—"}
                        </div>
                        <div>
                            <span className="font-medium text-slate-200">Active round:</span>{" "}
                            {activeRoundId ?? "—"} ({describePhase(activePhase)})
                        </div>
                        <div>
                            <span className="font-medium text-slate-200">Pending tx:</span>{" "}
                            {pendingTransaction ?? "—"}
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                        {!isWalletAvailable && <p className="text-sm text-red-400">No wallet detected.</p>}
                        <button
                            type="button"
                            onClick={() => void handleConnectWallet()}
                            disabled={isConnecting || !provider}
                            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isConnecting ? "Connecting…" : "Connect wallet"}
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
                    <h2 className="text-lg font-semibold">Choose numbers</h2>
                    <div className="mt-3 flex gap-3 text-sm">
                        <button
                            type="button"
                            className={`rounded-lg px-3 py-1 font-semibold transition ${
                                entryMode === "manual"
                                    ? "bg-emerald-500 text-emerald-950"
                                    : "border border-slate-800 text-slate-200 hover:border-emerald-400"
                            }`}
                            onClick={() => setEntryMode("manual")}
                        >
                            Manual pick
                        </button>
                        <button
                            type="button"
                            className={`rounded-lg px-3 py-1 font-semibold transition ${
                                entryMode === "auto"
                                    ? "bg-emerald-500 text-emerald-950"
                                    : "border border-slate-800 text-slate-200 hover:border-emerald-400"
                            }`}
                            onClick={() => setEntryMode("auto")}
                        >
                            Auto pick
                        </button>
                    </div>

                    <div className="mt-4 text-sm text-slate-300">
                        <p>
                            Ticket price per entry:{" "}
                            <strong className="text-slate-100">
                                {ticketPrice ? `${ticketPrice} KAIA` : "—"}
                            </strong>
                        </p>
                        <p className="mt-1">
                            Total cost for this purchase:{" "}
                            <strong className="text-slate-100">{totalPriceDisplay}</strong>
                        </p>
                    </div>

                    {entryMode === "manual" ? (
                        <div className="mt-6 space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm text-slate-300">
                                        Select up to {MAX_TICKETS_PER_PURCHASE} tickets. Each ticket needs{" "}
                                        {NUMBER_OF_PICKS} unique numbers between {MIN_NUMBER} and {MAX_NUMBER}, plus a lucky
number.
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={addManualTicket}
                                        disabled={manualTickets.length >= MAX_TICKETS_PER_PURCHASE}
                                        className="rounded-lg border border-emerald-400 px-3 py-1 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Add ticket
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {manualTickets.map((ticket, index) => {
                                    const error = manualTicketErrors.get(ticket.id);

                                    return (
                                        <div
                                            key={ticket.id}
                                            className={`rounded-xl border p-4 transition ${
                                                error ? "border-red-400/60 bg-red-500/10" : "border-slate-800 bg-slate-950/60"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="text-base font-semibold text-slate-100">
                                                        Ticket {index + 1}
                                                    </h3>
                                                    <p className="text-xs text-slate-400">
                                                        Pick {NUMBER_OF_PICKS} numbers and one lucky number
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeManualTicket(ticket.id)}
                                                        disabled={manualTickets.length <= 1}
                                                        className="rounded-lg border border-red-400/60 px-3 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-200">Main numbers</h4>
                                                    <div className="mt-2 grid grid-cols-9 gap-2">
                                                        {Array.from({ length: MAX_NUMBER }, (_, idx) => idx + MIN_NUMBER).map(
                                                            (value) => {
                                                                const isSelected = ticket.numbers.includes(value);
                                                                const isLucky = ticket.luckyNumber === value;
                                                                const isDisabled =
                                                                    !isSelected &&
                                                                    ticket.numbers.length >= NUMBER_OF_PICKS;

                                                                return (
                                                                    <ManualNumberButton
                                                                        key={value}
                                                                        value={value}
                                                                        isSelected={isSelected}
                                                                        isLucky={isLucky}
                                                                        disabled={isDisabled}
                                                                        onClick={() => toggleManualNumber(ticket.id, value)}
                                                                    />
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-semibold text-amber-200">Lucky number</h4>
                                                    <div className="mt-2 grid grid-cols-9 gap-2">
                                                        {Array.from({ length: MAX_NUMBER }, (_, idx) => idx + MIN_NUMBER).map(
                                                            (value) => {
                                                                const isLucky = ticket.luckyNumber === value;
                                                                const isMain = ticket.numbers.includes(value);

                                                                return (
                                                                    <LuckyNumberButton
                                                                        key={`lucky-${value}`}
                                                                        value={value}
                                                                        isLucky={Boolean(isLucky)}
                                                                        isMain={isMain}
                                                                        onClick={() => setManualLuckyNumber(ticket.id, value)}
                                                                    />
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm text-slate-300">
                                        Generate up to {MAX_TICKETS_PER_PURCHASE} unique tickets. Each ticket will include{" "}
                                        {NUMBER_OF_PICKS} numbers and a separate lucky number.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <label className="flex items-center gap-2 text-sm">
                                        Quantity:
                                        <input
                                            type="number"
                                            min={1}
                                            max={MAX_TICKETS_PER_PURCHASE}
                                            value={autoCount}
                                            onChange={(event) => setAutoCount(Number(event.target.value))}
                                            className="w-20 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={resetAutoTickets}
                                        className="rounded-lg border border-emerald-400 px-3 py-1 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/10"
                                    >
                                        Refresh tickets
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
                                            <span className="font-semibold uppercase tracking-wide text-slate-500">Ticket {index
 + 1}</span>
                                            <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-200">
                                                Auto pick
                                            </span>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {ticket.numbers.map((value) => (
                                                <span
                                                    key={`${ticket.signature}-${value}`}
                                                    className="rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-sm font-semibold text-emerald-200"
                                                >
                                                    {value}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="mt-4 flex items-center gap-3 border-t border-slate-800 pt-3">
                                            <span className="text-xs uppercase tracking-wide text-amber-300/70">Lucky</span>
                                            <span className="rounded-md border border-amber-400/40 bg-amber-500/10 px-2.5 py-1 text-sm font-semibold text-amber-200">
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
                            disabled={status === "uploading" || status === "minting"}
                        >
                            {status === "uploading"
                                ? "Uploading metadata…"
                                : status === "minting"
                                    ? "Awaiting transaction…"
                                    : "Buy tickets"}
                        </button>
                        {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}
                        {status === "success" && (
                            <div className="rounded-lg border border-emerald-600 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                                <p>
                                    {successTokenIds.length > 1
                                        ? "Tickets purchased successfully."
                                        : "Ticket purchased successfully."}
                                </p>
                                {successTokenIds.length > 0 && <p>Token IDs: {successTokenIds.join(", ")}</p>}
                                {transactionHash && (
                                    <p>
                                        Transaction:{" "}
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
                                <div key={ticket.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
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
                                            <dd className="font-medium text-slate-100">{ticket.numbers.join(", ")}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-slate-500">Lucky number</dt>
                                            <dd className="font-medium text-slate-100">{ticket.luckyNumber}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-slate-500">Mode</dt>
                                            <dd className="font-medium text-slate-100">{ticket.isAutoPick ? "Auto" : "Manual"}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-slate-500">Claimed</dt>
                                            <dd className="font-medium text-slate-100">{ticket.claimed ? "Yes" : "No"}</dd>
                                        </div>
                                    </dl>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
            {toastMessage && (
                <div className="pointer-events-none fixed right-4 top-4 z-50 max-w-xs rounded-lg border border-red-500/40 bg-red-500/20 px-4 py-3 text-sm text-red-100 shadow-lg">
                    {toastMessage}
                </div>
            )}
        </main>
    );
}
