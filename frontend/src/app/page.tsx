"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Interface, JsonRpcProvider, formatEther } from "ethers";

import lottoAbi from "../../lib/abi.json";
import RoundStatsGrid from "@/components/RoundStatsGrid";
import { useLottoContractContext } from "@/hooks/useLottoContract";
import type { RoundInfo, TicketData } from "@/hooks/useLottoContract";
import { address as contractAddress, rpcUrl as contractRpcUrl } from "../../lib/contractConfig";

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

type TicketMetadata = {
    fortune?: string;
    timestamp?: string;
    [key: string]: unknown;
};

const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

const formatDuration = (totalSeconds: number): string => {
    const abs = Math.max(0, Math.floor(totalSeconds));

    const days = Math.floor(abs / 86_400);
    const hours = Math.floor((abs % 86_400) / 3_600);
    const minutes = Math.floor((abs % 3_600) / 60);
    const seconds = abs % 60;

    const segments: string[] = [];
    if (days > 0) {
        segments.push(`${days}d`);
    }
    if (hours > 0 || segments.length > 0) {
        segments.push(`${hours}h`);
    }
    if (minutes > 0 || segments.length > 0) {
        segments.push(`${minutes}m`);
    }
    if (segments.length < 2) {
        segments.push(`${seconds}s`);
    }

    return segments.slice(0, 3).join(" ") || "0s";
};

const formatCountdownLabel = (diffSeconds: number, futurePrefix: string, pastPrefix: string) => {
    if (!Number.isFinite(diffSeconds)) {
        return null;
    }

    if (diffSeconds > 0) {
        return `${futurePrefix} in ${formatDuration(diffSeconds)}`;
    }
    if (diffSeconds < 0) {
        return `${pastPrefix} ${formatDuration(-diffSeconds)} ago`;
    }

    return `${futurePrefix} now`;
};

const formatTimestamp = (seconds?: number | null) => {
    if (!seconds || seconds <= 0) {
        return "—";
    }

    try {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(seconds * 1000));
    } catch {
        return new Date(seconds * 1000).toISOString();
    }
};

const resolveIpfsUri = (uri?: string | null) => {
    if (!uri) {
        return null;
    }

    if (uri.startsWith("ipfs://")) {
        const path = uri.slice("ipfs://".length);
        return `${IPFS_GATEWAY}${path}`;
    }

    return uri;
};

const FORTUNE_MESSAGES = [
    "Lucky winds are shifting in your favor.",
    "Your numbers unlock a door you didn't know existed.",
    "A surprise ally will boost your chances soon.",
    "Fortune favors the bold—stay the course.",
    "Tiny risks today grow into giant rewards tomorrow.",
    "An unexpected message will bring clarity.",
    "Trust your instincts; they are sharper than luck.",
    "Serendipity arrives when you least expect it.",
    "Your lucky number wants to be the hero this round.",
    "Collect good vibes—they compound like interest.",
    "A calm mind spots the winning pattern first.",
    "Your optimism is a magnet for jackpot energy.",
];

const generateFortune = (numbers: number[], luckyNumber: number, metadata?: TicketMetadata) => {
    if (metadata && typeof metadata.fortune === "string" && metadata.fortune.trim().length > 0) {
        return metadata.fortune.trim();
    }

    const signature = `${numbers.join("-")}|${luckyNumber}`;
    const checksum = Array.from(signature).reduce((total, char) => total + char.charCodeAt(0), 0);
    return FORTUNE_MESSAGES[checksum % FORTUNE_MESSAGES.length];
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
        getRoundInfo,
        buyTickets,
        isWalletAvailable,
        getTicketData,
        uploadMetadata,
        pendingTransaction,
        ticketPrice,
        claimPrize,
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
    const [activeRound, setActiveRound] = useState<RoundInfo | null>(null);
    const [resolvedName, setResolvedName] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<string | null>(null);
    const [networkLabel, setNetworkLabel] = useState<string | null>(null);
    const [roundCountdown, setRoundCountdown] = useState<{ startLabel: string | null; endLabel: string | null }>(
        {
            startLabel: null,
            endLabel: null,
        },
    );
    const [metadataByTicket, setMetadataByTicket] = useState<Record<string, TicketMetadata>>({});
    const [roundInfoCache, setRoundInfoCache] = useState<Record<string, RoundInfo>>({});
    const [claimingTicketId, setClaimingTicketId] = useState<string | null>(null);
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

    const fallbackProvider = useMemo(() => {
        const url = contractRpcUrl?.trim() || "https://public-en-kairos.node.kaia.io";

        try {
            return new JsonRpcProvider(url);
        } catch (error) {
            console.warn("Failed to create fallback provider", error);
            return null;
        }
    }, [contractRpcUrl]);

    useEffect(() => {
        const loadRoundInfo = async () => {
            try {
                const round = await getActiveRound();
                setActiveRound(round);
                if (round) {
                    const key = round.id.toString();
                    setRoundInfoCache((previous) => ({
                        ...previous,
                        [key]: round,
                    }));
                }
            } catch (error) {
                console.error("Failed to load round info", error);
            }
        };

        void loadRoundInfo();
    }, [getActiveRound]);

    useEffect(() => {
        if ((!provider && !fallbackProvider) || !address) {
            setResolvedName(null);
            setWalletBalance(null);
            return;
        }

        let cancelled = false;

        const providersToTry = [fallbackProvider, provider].filter(
            (candidate): candidate is NonNullable<typeof provider> | JsonRpcProvider => candidate != null,
        );

        const loadWalletInfo = async () => {
            let lastError: unknown = null;

            for (const currentProvider of providersToTry) {
                try {
                    const [nameResult, balanceResult] = await Promise.all([
                        currentProvider.lookupAddress(address).catch(() => null),
                        currentProvider.getBalance(address),
                    ]);

                    if (!cancelled) {
                        setResolvedName(typeof nameResult === "string" ? nameResult : null);
                        setWalletBalance(formatEther(balanceResult));
                    }
                    return;
                } catch (error) {
                    lastError = error;
                }
            }

            if (!cancelled) {
                setResolvedName(null);
                setWalletBalance(null);
            }

            if (!cancelled && lastError) {
                const message = extractErrorMessage(lastError);
                const detail = message ? `: ${message}` : "";
                console.warn(`Failed to load wallet info via available providers${detail}`, lastError);
            }
        };

        void loadWalletInfo();

        return () => {
            cancelled = true;
        };
    }, [provider, address, fallbackProvider]);

    useEffect(() => {
        if (!provider) {
            setNetworkLabel(null);
            return;
        }

        let cancelled = false;

        const loadNetwork = async () => {
            try {
                const network = await provider.getNetwork();
                if (!cancelled) {
                    const label =
                        network?.name && network.name !== "unknown"
                            ? `${network.name} (#${network.chainId})`
                            : network?.chainId
                                ? `Chain #${network.chainId}`
                                : null;
                    setNetworkLabel(label);
                }
            } catch (error) {
                console.error("Failed to load network info", error);
                if (!cancelled) {
                    setNetworkLabel(chainId != null ? `Chain #${chainId}` : null);
                }
            }
        };

        void loadNetwork();

        return () => {
            cancelled = true;
        };
    }, [provider, chainId]);

    useEffect(() => {
        if (!activeRound) {
            setRoundCountdown({ startLabel: null, endLabel: null });
            return;
        }

        let cancelled = false;

        const updateCountdown = () => {
            const now = Math.floor(Date.now() / 1000);
            const startDiff = activeRound.startTime - now;
            const endDiff = activeRound.endTime - now;

            const startLabel = formatCountdownLabel(startDiff, "Starts", "Started");
            const endLabel = formatCountdownLabel(endDiff, "Closes", "Closed");

            if (!cancelled) {
                setRoundCountdown({ startLabel, endLabel });
            }
        };

        updateCountdown();
        const timer = window.setInterval(updateCountdown, 1000);

        return () => {
            cancelled = true;
            window.clearInterval(timer);
        };
    }, [activeRound]);

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

    useEffect(() => {
        if (latestTickets.length === 0) {
            return;
        }

        const pendingMetadata = latestTickets.filter(
            (ticket) => ticket.tokenURI && !metadataByTicket[ticket.id],
        );

        if (pendingMetadata.length === 0) {
            return;
        }

        let cancelled = false;

        void (async () => {
            const entries = await Promise.all(
                pendingMetadata.map(async (ticket) => {
                    const url = resolveIpfsUri(ticket.tokenURI);
                    if (!url) {
                        return null;
                    }

                    try {
                        const response = await fetch(url);
                        if (!response.ok) {
                            throw new Error(`Metadata request failed with status ${response.status}`);
                        }
                        const data = (await response.json()) as TicketMetadata;
                        return { id: ticket.id, data };
                    } catch (error) {
                        console.error("Failed to load ticket metadata", error);
                        return null;
                    }
                }),
            );

            if (!cancelled) {
                setMetadataByTicket((previous) => {
                    const next = { ...previous };
                    for (const entry of entries) {
                        if (entry?.data) {
                            next[entry.id] = entry.data;
                        }
                    }
                    return next;
                });
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [latestTickets, metadataByTicket]);

    useEffect(() => {
        if (latestTickets.length === 0) {
            return;
        }

        const uniqueRoundIds = Array.from(
            new Set(latestTickets.map((ticket) => ticket.roundId)),
        ).filter((roundId) => !roundInfoCache[roundId]);

        if (uniqueRoundIds.length === 0) {
            return;
        }

        let cancelled = false;

        void (async () => {
            const entries = await Promise.all(
                uniqueRoundIds.map(async (roundId) => {
                    try {
                        const info = await getRoundInfo(BigInt(roundId));
                        if (info) {
                            return { roundId, info };
                        }
                    } catch (error) {
                        console.error("Failed to fetch round info for ticket", error);
                    }
                    return null;
                }),
            );

            if (!cancelled) {
                setRoundInfoCache((previous) => {
                    const next = { ...previous };
                    for (const entry of entries) {
                        if (entry?.info) {
                            next[entry.roundId] = entry.info;
                        }
                    }
                    return next;
                });
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [latestTickets, roundInfoCache, getRoundInfo]);

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

    const handleClaimPrize = useCallback(
        async (ticket: TicketData) => {
            try {
                setToastMessage(null);
                setClaimingTicketId(ticket.id);
                const receipt = await claimPrize(BigInt(ticket.id));
                if (receipt) {
                    setLatestTickets((previous) =>
                        previous.map((entry) =>
                            entry.id === ticket.id
                                ? { ...entry, claimed: true }
                                : entry,
                        ),
                    );
                    setToastMessage("Prize claimed successfully.");
                }
            } catch (error) {
                console.error("Failed to claim prize", error);
                setToastMessage(extractErrorMessage(error));
            } finally {
                setClaimingTicketId(null);
            }
        },
        [claimPrize],
    );

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
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                        <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 ${
                                address
                                    ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-200"
                                    : "border-slate-700 bg-slate-800 text-slate-300"
                            }`}
                        >
                            {address ? "Wallet connected" : "Wallet disconnected"}
                        </span>
                        <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 ${
                                isWrongNetwork
                                    ? "border-red-400/60 bg-red-500/10 text-red-200"
                                    : "border-emerald-400/60 bg-emerald-500/10 text-emerald-200"
                            }`}
                        >
                            {isWrongNetwork
                                ? `Wrong network (expected ${expectedChainId})`
                                : "Network ready"}
                        </span>
                        {activeRound && (
                            <span className="inline-flex items-center rounded-full border border-amber-400/60 bg-amber-500/10 px-3 py-1 text-amber-200">
                                Round {activeRound.id.toString()} · {describePhase(activeRound.phase)}
                            </span>
                        )}
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
                        <div>
                            <span className="font-medium text-slate-200">Address:</span>{" "}
                            {address ?? "Not connected"}
                            {resolvedName && (
                                <p className="text-xs text-slate-500">Resolved as {resolvedName}</p>
                            )}
                        </div>
                        <div>
                            <span className="font-medium text-slate-200">Balance:</span>{" "}
                            {walletBalance ? `${walletBalance} KAIA` : "—"}
                        </div>
                        <div>
                            <span className="font-medium text-slate-200">Network:</span>{" "}
                            {networkLabel ?? "—"}
                        </div>
                        <div>
                            <span className="font-medium text-slate-200">Ticket price:</span>{" "}
                            {ticketPrice ? `${ticketPrice} KAIA` : "—"}
                        </div>
                        <div>
                            <span className="font-medium text-slate-200">Active round:</span>{" "}
                            {activeRound
                                ? `${activeRound.id.toString()} (${describePhase(activeRound.phase)})`
                                : "—"}
                        </div>
                        <div>
                            <span className="font-medium text-slate-200">Pending tx:</span>{" "}
                            {pendingTransaction ?? "—"}
                        </div>
                        <div className="md:col-span-2">
                            <span className="font-medium text-slate-200">Round timers:</span>
                            <div className="mt-1 space-y-1 text-xs text-slate-400">
                                <div>Start: {roundCountdown.startLabel ?? "—"}</div>
                                <div>Close: {roundCountdown.endLabel ?? "—"}</div>
                            </div>
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
                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg font-semibold">Round snapshot</h2>
                        <p className="text-sm text-slate-400">
                            {activeRound
                                ? `Tracking round #${activeRound.id.toString()} (${describePhase(activeRound.phase)})`
                                : "No active round detected."}
                        </p>
                    </div>
                    <RoundStatsGrid round={activeRound} className="mt-4" />
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
                            {latestTickets.map((ticket) => {
                                const metadata = metadataByTicket[ticket.id];
                                const fortune = generateFortune(ticket.numbers, ticket.luckyNumber, metadata);
                                const metadataUrl = resolveIpfsUri(ticket.tokenURI);
                                const explorerUrl =
                                    contractAddress && typeof contractAddress === "string"
                                        ? `https://kairos.kaiascan.io/token/${contractAddress}?a=${ticket.id}`
                                        : null;
                                const roundInfo = roundInfoCache[ticket.roundId];
                                const isClaiming = claimingTicketId === ticket.id;
                                const hasPendingTx = Boolean(pendingTransaction);

                                let claimStatus = "";
                                let claimDisabled = false;

                                if (ticket.claimed) {
                                    claimStatus = "Already claimed.";
                                    claimDisabled = true;
                                } else if (ticket.tier === 0) {
                                    claimStatus = "No prize for this ticket.";
                                    claimDisabled = true;
                                } else if (!roundInfo) {
                                    claimStatus = "Awaiting round status.";
                                    claimDisabled = true;
                                } else if (roundInfo.phase !== "claimable") {
                                    claimStatus = "Round not claimable yet.";
                                    claimDisabled = true;
                                } else if (!roundInfo.payoutsFinalized) {
                                    claimStatus = "Payouts pending finalization.";
                                    claimDisabled = true;
                                } else if (hasPendingTx) {
                                    claimStatus = "Wait for the pending transaction to complete.";
                                    claimDisabled = true;
                                } else {
                                    claimStatus = "Ready to claim!";
                                }

                                if (isClaiming) {
                                    claimStatus = "Claiming in progress…";
                                }

                                const claimButtonLabel = ticket.claimed
                                    ? "Claimed"
                                    : isClaiming
                                        ? "Claiming…"
                                        : "Claim prize";

                                const roundStatus = roundInfo
                                    ? `${describePhase(roundInfo.phase)} · ${
                                          roundInfo.payoutsFinalized ? "Payouts finalized" : "Payouts pending"
                                      }`
                                    : "—";

                                const tierLabel = ticket.tier > 0 ? `Tier ${ticket.tier}` : "—";

                                return (
                                    <div key={ticket.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <h3 className="text-base font-semibold text-slate-100">
                                                    Ticket #{ticket.id}
                                                </h3>
                                                <p className="text-xs text-slate-500">
                                                    Purchased {formatTimestamp(ticket.purchasedAt)}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2 text-xs">
                                                {metadataUrl && (
                                                    <a
                                                        href={metadataUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center rounded border border-emerald-400/60 px-3 py-1 font-semibold text-emerald-200 transition hover:bg-emerald-500/10"
                                                    >
                                                        Metadata
                                                    </a>
                                                )}
                                                {explorerUrl && (
                                                    <a
                                                        href={explorerUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center rounded border border-slate-700 px-3 py-1 font-semibold text-slate-300 transition hover:border-emerald-400 hover:text-emerald-200"
                                                    >
                                                        View on explorer
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <dl className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                                            <div>
                                                <dt className="text-slate-500">Round</dt>
                                                <dd className="font-medium text-slate-100">#{ticket.roundId}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-slate-500">Mode</dt>
                                                <dd className="font-medium text-slate-100">{ticket.isAutoPick ? "Auto" : "Manual"}</dd>
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
                                                <dt className="text-slate-500">Winning tier</dt>
                                                <dd className="font-medium text-slate-100">{tierLabel}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-slate-500">Round payout status</dt>
                                                <dd className="font-medium text-slate-100">{roundStatus}</dd>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <dt className="text-slate-500">Fortune cookie</dt>
                                                <dd className="font-medium text-slate-100">{fortune}</dd>
                                            </div>
                                        </dl>
                                        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <button
                                                type="button"
                                                onClick={() => void handleClaimPrize(ticket)}
                                                disabled={claimDisabled || isClaiming}
                                                className="inline-flex w-full justify-center rounded-lg border border-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                            >
                                                {claimButtonLabel}
                                            </button>
                                            <p className="text-xs text-slate-500">{claimStatus}</p>
                                        </div>
                                    </div>
                                );
                            })}
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
