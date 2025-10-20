'use client';

import {
    BrowserProvider,
    Contract,
    JsonRpcProvider,
    JsonRpcSigner,
    TransactionReceipt,
    TransactionResponse,
    formatEther,
} from 'ethers';
import type { Eip1193Provider } from 'ethers';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import type { ReactNode } from 'react';

import lottoAbi from '../../lib/abi.json';
import { contractConfig } from '../../lib/contractConfig';
import { allowedAdminAddresses as staticAllowedAdmins } from '../../lib/adminConfig';

type RoundPhase = 'sales' | 'drawing' | 'claimable';

type PhaseMapping = Record<number, RoundPhase>;

const PHASE_MAP: PhaseMapping = {
    0: 'sales',
    1: 'drawing',
    2: 'claimable',
};

export type TicketData = {
    id: string;
    roundId: string;
    purchasedAt: number;
    numbers: number[];
    luckyNumber: number;
    isAutoPick: boolean;
    tier: number;
    claimed: boolean;
    tokenURI: string | null;
};

export type TicketPurchasePayload = {
    numbers: number[];
    luckyNumber: number;
    isAutoPick: boolean;
    tokenURI: string;
};

export type MetadataUploadTicketPayload = {
    numbers: number[];
    luckyNumber: number;
    address: string;
    isAutoPick: boolean;
};

export type MetadataUploadResult = {
    success: boolean;
    uri?: string;
    error?: string;
};

export type RoundInfo = {
    id: bigint;
    startTime: number;
    endTime: number;
    phase: RoundPhase;
    ticketCount: bigint;
    gross: bigint;
    carryIn: bigint;
    carryOut: bigint;
    winningNumbers: number[];
    luckyNumber: number | null;
    firstWinners: number;
    secondWinners: number;
    thirdWinners: number;
    pFirst: bigint;
    pSecond: bigint;
    pThird: bigint;
    payoutsFinalized: boolean;
};

export type LottoContractContextValue = {
    provider: BrowserProvider | null;
    signer: JsonRpcSigner | null;
    address: string | null;
    chainId: number | null;
    expectedChainId: number;
    expectedChainHex: `0x${string}`;
    isWrongNetwork: boolean;
    isConnecting: boolean;
    isWalletAvailable: boolean;
    pendingTransaction: string | null;
    ticketPrice: string | null;
    ownerAddress: string | null;
    currentRoundId: bigint | null;
    isAuthorizedOperator: boolean;
    allowedAdminAddresses: string[];
    connectWallet: () => Promise<void>;
    disconnectWallet: () => Promise<void>;
    switchToExpectedNetwork: () => Promise<void>;
    getTicketPrice: () => Promise<bigint | null>;
    getActiveRound: () => Promise<RoundInfo | null>;
    getRoundInfo: (roundId: number | bigint) => Promise<RoundInfo | null>;
    getTicketData: (ticketId: number | bigint) => Promise<TicketData | null>;
    uploadMetadata: (tickets: MetadataUploadTicketPayload[]) => Promise<MetadataUploadResult[]>;
    buyTickets: (tickets: TicketPurchasePayload[]) => Promise<TransactionReceipt | null>;
    buyTicket: (
        numbers: Array<number>,
        luckyNumber: number,
        isAutoPick: boolean,
        tokenURI: string,
    ) => Promise<TransactionReceipt | null>;
    claimPrize: (ticketId: number | bigint) => Promise<TransactionReceipt | null>;
    closeCurrentRound: () => Promise<TransactionReceipt | null>;
    startNextRound: (startTime?: number) => Promise<TransactionReceipt | null>;
    requestRandomWinningNumbers: (roundId: number | bigint) => Promise<TransactionReceipt | null>;
    finalizePayouts: (roundId: number | bigint) => Promise<TransactionReceipt | null>;
};

const DEFAULT_CHAIN_ID = 1001;
const DEFAULT_RPC_URL = 'https://public-en-kairos.node.kaia.io';
const DEFAULT_BLOCK_EXPLORER = 'https://kairos.kaiascan.io';
const CHAIN_NAME = 'Kaia Kairos Testnet';
const NATIVE_CURRENCY = {
    name: 'Kaia',
    symbol: 'KAIA',
    decimals: 18,
};

const getExpectedChainId = () => {
    if (typeof contractConfig.chainId === 'number' && !Number.isNaN(contractConfig.chainId)) {
        return contractConfig.chainId;
    }
    return DEFAULT_CHAIN_ID;
};

const getExpectedRpcUrl = () => contractConfig.rpcUrl ?? DEFAULT_RPC_URL;
const CONTRACT_ADDRESS = contractConfig.address;
const allowedAdminAddresses = staticAllowedAdmins ?? [];
const CONFIGURED_RPC_URL = contractConfig.rpcUrl;

const normalizeAddress = (value: string | null | undefined) =>
    (value ? value.toLowerCase() : null);
const REQUIRED_NUMBERS = 6;
const MIN_NUMBER = 1;
const MAX_NUMBER = 45;

const FRIENDLY_ERROR_MESSAGES: Record<string, string> = {
    AlreadyClaimed: 'This ticket has already been claimed.',
    AlreadyFinalized: 'Payouts for this round are already finalized.',
    InvalidBatchLength: 'Ticket submission was malformed. Please try again.',
    InvalidNumbers: 'One or more ticket numbers are invalid. Please double-check your picks.',
    NoPrize: 'This ticket is not eligible for a prize.',
    NotTicketOwner: 'You must own the ticket to perform this action.',
    PayoutsNotReady: 'Payouts are not ready yet. Please wait for the draw to finish.',
    TicketNotFound: 'The requested ticket could not be found.',
    TooManyTickets: 'You can purchase up to 50 tickets per transaction.',
    WrongPhase: 'Ticket sales are currently closed.',
};

const cleanRevertReason = (value: string): string =>
    value.replace(/^execution reverted:?\s*/i, '').trim();

const isMissingRevertDataMessage = (value: string | null | undefined): boolean =>
    typeof value === 'string' && value.toLowerCase().includes('missing revert data');

const getRevertData = (error: any): string | null => {
    if (!error || typeof error !== 'object') {
        return null;
    }

    const candidates = [
        error.data,
        error.error?.data,
        error.error?.error?.data,
        error.info?.error?.data,
        error.info?.error?.error?.data,
    ];

    for (const value of candidates) {
        if (typeof value === 'string' && value) {
            return value;
        }
    }

    return null;
};

const extractReasonMessage = (error: any): string | null => {
    if (!error || typeof error !== 'object') {
        return null;
    }

    const candidates = [
        error.shortMessage,
        error.reason,
        error.error?.message,
        error.info?.error?.message,
        error.message,
    ];

    for (const value of candidates) {
        if (typeof value === 'string' && value.trim()) {
            return value;
        }
    }

    return null;
};

const normalizeContractError = (
    contractInstance: Contract | null,
    error: unknown,
    fallbackMessage: string,
): Error => {
    if (contractInstance) {
        const revertData = getRevertData(error);
        if (revertData) {
            try {
                const decoded = contractInstance.interface.parseError(revertData);
                if (decoded?.name) {
                    const friendly = FRIENDLY_ERROR_MESSAGES[decoded.name];
                    if (friendly) {
                        const wrapped = new Error(friendly);
                        (wrapped as any).cause = error;
                        return wrapped;
                    }
                    const wrapped = new Error(decoded.name);
                    (wrapped as any).cause = error;
                    return wrapped;
                }
            } catch (decodeError) {
                console.error('Failed to decode contract error', decodeError);
            }
        }
    }

    if (error instanceof Error) {
        const reason = extractReasonMessage(error);
        if (reason && !isMissingRevertDataMessage(reason)) {
            const wrapped = new Error(cleanRevertReason(reason));
            (wrapped as any).cause = error;
            return wrapped;
        }

        if (!isMissingRevertDataMessage(error.message)) {
            return error;
        }
    }

    return new Error(fallbackMessage);
};

const mapPhase = (value: bigint | number): RoundPhase => {
    const numeric = typeof value === 'bigint' ? Number(value) : value;
    return PHASE_MAP[numeric] ?? 'sales';
};

const roundInfoFromContract = (payload: any): RoundInfo => {
    const rawWinningNumbers = Array.from(payload.winningNumbers ?? []) as Array<bigint | number>;
    const normalizedWinningNumbers = rawWinningNumbers
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value > 0);

    const luckyValue = payload.luckyNumber ? Number(payload.luckyNumber) : null;

    return {
        id: BigInt(payload.id ?? 0),
        startTime: Number(payload.startTime ?? 0),
        endTime: Number(payload.endTime ?? 0),
        phase: mapPhase(payload.phase ?? 0),
        ticketCount: BigInt(payload.ticketCount ?? 0),
        gross: BigInt(payload.gross ?? 0),
        carryIn: BigInt(payload.carryIn ?? 0),
        carryOut: BigInt(payload.carryOut ?? 0),
        winningNumbers: normalizedWinningNumbers,
        luckyNumber: luckyValue,
        firstWinners: Number(payload.firstWinners ?? 0),
        secondWinners: Number(payload.secondWinners ?? 0),
        thirdWinners: Number(payload.thirdWinners ?? 0),
        pFirst: BigInt(payload.pFirst ?? 0),
        pSecond: BigInt(payload.pSecond ?? 0),
        pThird: BigInt(payload.pThird ?? 0),
        payoutsFinalized: Boolean(payload.payoutsFinalized ?? false),
    };
};

const ticketInfoFromContract = (payload: any): TicketData => {
    const numbersArray = Array.from(payload.numbers ?? []) as Array<bigint | number>;

    return {
        id: BigInt(payload.ticketId ?? 0).toString(),
        roundId: BigInt(payload.roundId ?? 0).toString(),
        purchasedAt: Number(payload.purchasedAt ?? 0),
        numbers: numbersArray.map((value) => Number(value)),
        luckyNumber: Number(payload.luckyNumber ?? 0),
        isAutoPick: Boolean(payload.isAutoPick ?? false),
        tier: Number(payload.tier ?? 0),
        claimed: Boolean(payload.claimed ?? false),
        tokenURI: typeof payload?.tokenURI === 'string' ? payload.tokenURI : null,
    };
};

export function useLottoContract(): LottoContractContextValue {
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);
    const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
    const [currentRoundId, setCurrentRoundId] = useState<bigint | null>(null);
    const [isWalletAvailable, setIsWalletAvailable] = useState<boolean>(true);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [pendingTransaction, setPendingTransaction] = useState<string | null>(null);
    const [ticketPrice, setTicketPrice] = useState<string | null>(null);

    const expectedChainId = useMemo(() => getExpectedChainId(), []);
    const expectedChainHex = useMemo(
        () => `0x${expectedChainId.toString(16)}` as `0x${string}`,
        [expectedChainId],
    );

    const staticProvider = useMemo<JsonRpcProvider | null>(() => {
        if (!CONFIGURED_RPC_URL) {
            return null;
        }

        try {
            return new JsonRpcProvider(CONFIGURED_RPC_URL);
        } catch (error) {
            console.error('Failed to initialize RPC provider', error);
            return null;
        }
    }, [CONFIGURED_RPC_URL]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const { ethereum } = window as typeof window & {
            ethereum?: (Eip1193Provider & {
                on?: (event: string, handler: (...args: any[]) => void) => void;
                removeListener?: (event: string, handler: (...args: any[]) => void) => void;
            }) | undefined;
        };

        if (!ethereum?.request) {
            setIsWalletAvailable(false);
            return;
        }

        const browserProvider = new BrowserProvider(ethereum, 'any');
        setProvider(browserProvider);

        const refreshAccountState = async () => {
            try {
                const accounts = await browserProvider.send('eth_accounts', []);
                const chainHex: string = await browserProvider.send('eth_chainId', []);
                setChainId(parseInt(chainHex, 16));

                if (accounts && accounts.length > 0) {
                    const signerInstance = await browserProvider.getSigner();
                    setSigner(signerInstance);
                    const signerAddress = await signerInstance.getAddress();
                    setAddress(signerAddress);
                } else {
                    setSigner(null);
                    setAddress(null);
                    setPendingTransaction(null);
                }
            } catch (error) {
                console.error('Failed to refresh wallet state', error);
            }
        };

        void refreshAccountState();

        const handleAccountsChanged = (accounts: string[]) => {
            if (!accounts || accounts.length === 0) {
                setSigner(null);
                setAddress(null);
                setPendingTransaction(null);
                return;
            }

            void (async () => {
                const signerInstance = await browserProvider.getSigner();
                setSigner(signerInstance);
                setAddress(accounts[0]);
            })();
        };

        const handleChainChanged = (nextChainId: string) => {
            setChainId(parseInt(nextChainId, 16));
        };

        ethereum.on?.('accountsChanged', handleAccountsChanged);
        ethereum.on?.('chainChanged', handleChainChanged);

        return () => {
            ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
            ethereum.removeListener?.('chainChanged', handleChainChanged);
        };
    }, []);

    const connectWallet = useCallback(async () => {
        if (!provider) {
            throw new Error('Wallet provider is not available.');
        }

        setIsConnecting(true);
        try {
            const accounts: string[] = await provider.send('eth_requestAccounts', []);
            const chainHex: string = await provider.send('eth_chainId', []);
            setChainId(parseInt(chainHex, 16));

            if (accounts.length === 0) {
                throw new Error('No accounts returned from wallet.');
            }

            const signerInstance = await provider.getSigner();
            setSigner(signerInstance);
            const signerAddress = await signerInstance.getAddress();
            setAddress(signerAddress);
        } finally {
            setIsConnecting(false);
        }
    }, [provider]);

    const disconnectWallet = useCallback(async () => {
        setSigner(null);
        setAddress(null);
        setPendingTransaction(null);

        if (!provider) {
            return;
        }

        const invoke = async (method: string, params: unknown[]) => {
            try {
                await provider.send(method, params);
            } catch (error: any) {
                const code = error?.code;
                if (code === -32601 || code === -32602 || code === 4001 || code === 4100) {
                    return;
                }
                console.warn(`Failed to call ${method} during disconnect`, error);
            }
        };

        await invoke('wallet_requestPermissions', []);
        await invoke('eth_requestAccounts', []);
    }, [provider]);

    const isWrongNetwork = useMemo(() => {
        if (chainId === null) return false;
        return chainId !== expectedChainId;
    }, [chainId, expectedChainId]);

    const switchToExpectedNetwork = useCallback(async () => {
        if (!provider) {
            throw new Error('Wallet provider is not available.');
        }

        try {
            await provider.send('wallet_switchEthereumChain', [{ chainId: expectedChainHex }]);
        } catch (error: any) {
            if (error?.code === 4902 || error?.code === -32603) {
                await provider.send('wallet_addEthereumChain', [
                    {
                        chainId: expectedChainHex,
                        chainName: CHAIN_NAME,
                        nativeCurrency: NATIVE_CURRENCY,
                        rpcUrls: [getExpectedRpcUrl()],
                        blockExplorerUrls: [DEFAULT_BLOCK_EXPLORER],
                    },
                ]);
                await provider.send('wallet_switchEthereumChain', [{ chainId: expectedChainHex }]);
            } else {
                throw error;
            }
        }
    }, [expectedChainHex, provider]);

    const contractWithSigner = useMemo(() => {
        if (!signer || !CONTRACT_ADDRESS) {
            return null;
        }

        return new Contract(CONTRACT_ADDRESS, lottoAbi, signer);
    }, [signer]);

    const readContract = useMemo(() => {
        const readProvider = staticProvider ?? signer?.provider ?? provider;

        if (!readProvider || !CONTRACT_ADDRESS) {
            return null;
        }

        return new Contract(CONTRACT_ADDRESS, lottoAbi, readProvider);
    }, [provider, signer, staticProvider]);

    useEffect(() => {
        if (!readContract) {
            setOwnerAddress(null);
            setCurrentRoundId(null);
            return;
        }

        let cancelled = false;

        const loadContractState = async () => {
            try {
                const [owner, roundId] = await Promise.all([
                    readContract.owner(),
                    readContract.currentRoundId(),
                ]);
                if (!cancelled) {
                    setOwnerAddress(owner as string);
                    setCurrentRoundId(roundId as bigint);
                }
            } catch (error) {
                console.error('Failed to load contract metadata', error);
            }
        };

        void loadContractState();

        return () => {
            cancelled = true;
        };
    }, [readContract]);

    useEffect(() => {
        const contractInstance = readContract ?? contractWithSigner;

        if (!contractInstance) {
            setTicketPrice(null);
            return;
        }

        let cancelled = false;

        const loadTicketPrice = async () => {
            try {
                const price: bigint = await contractInstance.ticketPrice();
                if (!cancelled) {
                    setTicketPrice(formatEther(price));
                }
            } catch (error) {
                console.error('Failed to load ticket price', error);
                if (!cancelled) {
                    setTicketPrice(null);
                }
            }
        };

        void loadTicketPrice();

        return () => {
            cancelled = true;
        };
    }, [contractWithSigner, readContract]);

    const getTicketPrice = useCallback(async () => {
        const contractInstance = readContract ?? contractWithSigner;
        if (!contractInstance) {
            return null;
        }

        try {
            const price: bigint = await contractInstance.ticketPrice();
            setTicketPrice(formatEther(price));
            return price;
        } catch (error) {
            console.error('Failed to fetch ticket price', error);
            setTicketPrice(null);
            return null;
        }
    }, [contractWithSigner, readContract]);

    const updatePending = useCallback((hash: string | null) => {
        setPendingTransaction(hash);
    }, []);

    const requireAuthorizedSigner = useCallback(() => {
        if (!contractWithSigner) {
            throw new Error('Connect your wallet before performing this action.');
        }

        const normalizedSigner = normalizeAddress(address);
        const normalizedOwner = normalizeAddress(ownerAddress);

        if (
            normalizedSigner &&
            (normalizedSigner === normalizedOwner || allowedAdminAddresses.includes(normalizedSigner))
        ) {
            return contractWithSigner;
        }

        throw new Error('You are not authorized to perform this action.');
    }, [address, contractWithSigner, ownerAddress]);

    const buyTickets = useCallback(
        async (tickets: TicketPurchasePayload[]): Promise<TransactionReceipt | null> => {
            if (!contractWithSigner) {
                throw new Error('Connect your wallet before buying tickets.');
            }

            if (!Array.isArray(tickets) || tickets.length === 0) {
                throw new Error('Provide at least one ticket to purchase.');
            }

            if (tickets.length > 50) {
                throw new Error('You can purchase up to 50 tickets per transaction.');
            }

            const normalizedTickets = tickets.map((ticket, index) => {
                const position = index + 1;

                if (!Array.isArray(ticket.numbers) || ticket.numbers.length !== REQUIRED_NUMBERS) {
                    throw new Error(`Ticket ${position}: exactly ${REQUIRED_NUMBERS} numbers are required.`);
                }

                const numericNumbers = ticket.numbers.map((value) => {
                    if (typeof value !== 'number' || Number.isNaN(value)) {
                        throw new Error(`Ticket ${position}: numbers must be numeric.`);
                    }
                    const intValue = Math.trunc(value);
                    if (intValue < MIN_NUMBER || intValue > MAX_NUMBER) {
                        throw new Error(`Ticket ${position}: numbers must be between ${MIN_NUMBER} and ${MAX_NUMBER}.`);
                    }
                    return intValue;
                });

                const unique = new Set(numericNumbers);
                if (unique.size !== REQUIRED_NUMBERS) {
                    throw new Error(`Ticket ${position}: numbers must be unique.`);
                }

                const luckyInt = Math.trunc(ticket.luckyNumber);
                if (Number.isNaN(luckyInt)) {
                    throw new Error(`Ticket ${position}: lucky number is required.`);
                }
                if (luckyInt < MIN_NUMBER || luckyInt > MAX_NUMBER) {
                    throw new Error(`Ticket ${position}: lucky number must be between ${MIN_NUMBER} and ${MAX_NUMBER}.`);
                }
                if (unique.has(luckyInt)) {
                    throw new Error(`Ticket ${position}: lucky number must be different from the six main numbers.`);
                }

                if (!ticket.tokenURI || typeof ticket.tokenURI !== 'string') {
                    throw new Error(`Ticket ${position}: tokenURI is required.`);
                }

                numericNumbers.sort((a, b) => a - b);

                return {
                    numbers: numericNumbers,
                    luckyNumber: luckyInt,
                    isAutoPick: Boolean(ticket.isAutoPick),
                    tokenURI: ticket.tokenURI,
                };
            });

            try {
                const rawPrice = await contractWithSigner.ticketPrice();
                let ticketPrice: bigint;

                if (typeof rawPrice === 'bigint') {
                    ticketPrice = rawPrice;
                } else if (rawPrice && typeof rawPrice === 'object' && 'toString' in rawPrice) {
                    const parsed = BigInt(rawPrice.toString());
                    ticketPrice = parsed;
                } else {
                    throw new Error('Failed to determine the ticket price.');
                }

                if (ticketPrice <= BigInt(0)) {
                    throw new Error('Ticket price is not configured. Please try again later.');
                }

                const count = BigInt(normalizedTickets.length);
                const totalCost = ticketPrice * count;

                const numbersPayload = normalizedTickets.map((ticket) => ticket.numbers);
                const luckyNumbersPayload = normalizedTickets.map((ticket) => ticket.luckyNumber);
                const autoPicksPayload = normalizedTickets.map((ticket) => ticket.isAutoPick);
                const tokenUrisPayload = normalizedTickets.map((ticket) => ticket.tokenURI);

                const tx: TransactionResponse = await contractWithSigner.buyTickets(
                    numbersPayload,
                    luckyNumbersPayload,
                    autoPicksPayload,
                    tokenUrisPayload,
                    {
                        value: totalCost,
                    },
                );
                updatePending(tx.hash);
                const receipt = await tx.wait();
                updatePending(null);
                return receipt ?? null;
            } catch (error) {
                updatePending(null);
                throw error;
            }
        },
        [contractWithSigner, updatePending],
    );

    const buyTicket = useCallback(
        async (
            numbers: Array<number>,
            luckyNumber: number,
            isAutoPick: boolean,
            tokenURI: string,
        ): Promise<TransactionReceipt | null> =>
            buyTickets([
                {
                    numbers,
                    luckyNumber,
                    isAutoPick,
                    tokenURI,
                },
            ]),
        [buyTickets],
    );

    const getTicketData = useCallback(
        async (ticketId: number | bigint): Promise<TicketData | null> => {
            if (!readContract) {
                return null;
            }

            try {
                const id = typeof ticketId === 'bigint' ? ticketId : BigInt(ticketId);
                const response = await readContract.getTicketInfo(id);
                const baseTicket = ticketInfoFromContract(response);

                try {
                    const uri = await readContract.tokenURI(id);
                    if (typeof uri === 'string') {
                        return { ...baseTicket, tokenURI: uri };
                    }
                } catch (error) {
                    console.warn('Failed to fetch token URI', error);
                }

                return baseTicket;
            } catch (error) {
                console.error('Failed to fetch ticket data', error);
                return null;
            }
        },
        [readContract],
    );

    const uploadMetadata = useCallback(
        async (tickets: MetadataUploadTicketPayload[]): Promise<MetadataUploadResult[]> => {
            if (!Array.isArray(tickets) || tickets.length === 0) {
                return [];
            }

            const requestPayload = {
                tickets: tickets.map((ticket) => ({
                    numbers: ticket.numbers,
                    luckyNumber: ticket.luckyNumber,
                    isAutoPick: ticket.isAutoPick,
                })),
                walletAddress: tickets[0]?.address,
                drawId: currentRoundId ? currentRoundId.toString() : undefined,
            };

            try {
                const response = await fetch('/api/uploadMetadata', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestPayload),
                });

                if (!response.ok) {
                    let message = 'Metadata upload failed.';
                    try {
                        const errorBody = await response.json();
                        if (errorBody?.error && typeof errorBody.error === 'string') {
                            message = errorBody.error;
                        }
                    } catch {
                        // Ignore JSON parsing errors and use default message.
                    }
                    throw new Error(message);
                }

                const payload = await response.json();
                const uris: string[] = Array.isArray(payload?.ipfsUris)
                    ? payload.ipfsUris
                    : payload?.ipfsUri
                        ? [payload.ipfsUri]
                        : [];

                return tickets.map((_, index) => ({
                    success: Boolean(uris[index]),
                    uri: uris[index],
                    error: uris[index] ? undefined : 'Metadata URI missing.',
                }));
            } catch (error) {
                console.error('Failed to upload metadata', error);
                throw error instanceof Error ? error : new Error('Metadata upload failed.');
            }
        },
        [currentRoundId],
    );

    const getRoundInfo = useCallback(
        async (roundId: number | bigint): Promise<RoundInfo | null> => {
            if (!readContract) {
                return null;
            }

            try {
                const id = typeof roundId === 'bigint' ? roundId : BigInt(roundId);
                const response = await readContract.getRoundInfo(id);
                return roundInfoFromContract(response);
            } catch (error) {
                console.error('Failed to fetch round info', error);
                return null;
            }
        },
        [readContract],
    );
    const getActiveRound = useCallback(async (): Promise<RoundInfo | null> => {
        if (!readContract) {
            return null;
        }

        try {
            const roundId: bigint = await readContract.currentRoundId();
            if (roundId === BigInt(0)) {
                return null;
            }
            const response = await readContract.getRoundInfo(roundId);
            return roundInfoFromContract(response);
        } catch (error) {
            console.error('Failed to load active round info', error);
            return null;
        }
    }, [readContract]);

    const closeCurrentRound = useCallback(async (): Promise<TransactionReceipt | null> => {
        const contractInstance = requireAuthorizedSigner();
        try {
            const tx: TransactionResponse = await contractInstance.closeCurrentRound();
            updatePending(tx.hash);
            const receipt = await tx.wait();
            updatePending(null);
            return receipt ?? null;
        } catch (error) {
            updatePending(null);
            throw error;
        }
    }, [requireAuthorizedSigner, updatePending]);

    const startNextRound = useCallback(
        async (startTime?: number): Promise<TransactionReceipt | null> => {
            const contractInstance = requireAuthorizedSigner();

            try {
                const args = startTime ? [BigInt(startTime)] : [BigInt(0)];
                const tx: TransactionResponse = await contractInstance.startNextRound(...args);
                updatePending(tx.hash);
                const receipt = await tx.wait();
                updatePending(null);
                if (receipt) {
                    const latest = await contractInstance.currentRoundId();
                    setCurrentRoundId(latest as bigint);
                }
                return receipt ?? null;
            } catch (error) {
                updatePending(null);
                throw error;
            }
        },
        [requireAuthorizedSigner, updatePending],
    );

    const requestRandomWinningNumbers = useCallback(
        async (roundId: number | bigint): Promise<TransactionReceipt | null> => {
            const contractInstance = requireAuthorizedSigner();
            const id = typeof roundId === 'bigint' ? roundId : BigInt(roundId);

            try {
                const tx: TransactionResponse = await contractInstance.requestRandomWinningNumbers(id);
                updatePending(tx.hash);
                const receipt = await tx.wait();
                updatePending(null);
                return receipt ?? null;
            } catch (error) {
                updatePending(null);
                throw error;
            }
        },
        [requireAuthorizedSigner, updatePending],
    );

    const finalizePayouts = useCallback(
        async (roundId: number | bigint): Promise<TransactionReceipt | null> => {
            const contractInstance = requireAuthorizedSigner();
            const id = typeof roundId === 'bigint' ? roundId : BigInt(roundId);

            try {
                const tx: TransactionResponse = await contractInstance.finalizePayouts(id);
                updatePending(tx.hash);
                const receipt = await tx.wait();
                updatePending(null);
                return receipt ?? null;
            } catch (error) {
                updatePending(null);
                throw error;
            }
        },
        [requireAuthorizedSigner, updatePending],
    );

    const claimPrize = useCallback(
        async (ticketId: number | bigint): Promise<TransactionReceipt | null> => {
            if (!contractWithSigner) {
                throw new Error('Connect your wallet before claiming prizes.');
            }

            const id = typeof ticketId === 'bigint' ? ticketId : BigInt(ticketId);

            try {
                const tx: TransactionResponse = await contractWithSigner.claimPrize(id);
                updatePending(tx.hash);
                const receipt = await tx.wait();
                updatePending(null);
                return receipt ?? null;
            } catch (error) {
                updatePending(null);
                throw error;
            }
        },
        [contractWithSigner, updatePending],
    );

    const isAuthorizedOperator = useMemo(() => {
        const normalizedSigner = normalizeAddress(address);
        const normalizedOwner = normalizeAddress(ownerAddress);
        return (
            normalizedSigner !== null &&
            (normalizedSigner === normalizedOwner || allowedAdminAddresses.includes(normalizedSigner))
        );
    }, [address, ownerAddress]);

    return {
        provider,
        signer,
        address,
        chainId,
        expectedChainId,
        expectedChainHex,
        isWrongNetwork,
        isConnecting,
        isWalletAvailable,
        pendingTransaction,
        ticketPrice,
        ownerAddress,
        currentRoundId,
        isAuthorizedOperator,
        allowedAdminAddresses,
        connectWallet,
        disconnectWallet,
        switchToExpectedNetwork,
        getTicketPrice,
        getActiveRound,
        getRoundInfo,
        getTicketData,
        uploadMetadata,
        buyTickets,
        buyTicket,
        claimPrize,
        closeCurrentRound,
        startNextRound,
        requestRandomWinningNumbers,
        finalizePayouts,
    };
}

const LottoContractContext = createContext<LottoContractContextValue | undefined>(undefined);

export function useLottoContractContext(): LottoContractContextValue {
    const context = useContext(LottoContractContext);

    if (!context) {
        throw new Error('useLottoContractContext must be used within a LottoContractProvider');
    }

    return context;
}

export function LottoContractProvider({ children }: { children: ReactNode }) {
    const value = useLottoContract();

    return (
        <LottoContractContext.Provider value={value}>{children}</LottoContractContext.Provider>
    );
}