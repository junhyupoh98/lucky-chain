'use client';

import {
    BrowserProvider,
    Contract,
    JsonRpcProvider,
    JsonRpcSigner,
    TransactionReceipt,
    TransactionResponse,
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
    ownerAddress: string | null;
    currentRoundId: bigint | null;
    isAuthorizedOperator: boolean;
    allowedAdminAddresses: string[];
    connectWallet: () => Promise<void>;
    switchToExpectedNetwork: () => Promise<void>;
    getTicketPrice: () => Promise<bigint | null>;
    getActiveRound: () => Promise<RoundInfo | null>;
    getRoundInfo: (roundId: number | bigint) => Promise<RoundInfo | null>;
    getTicketData: (ticketId: number | bigint) => Promise<TicketData | null>;
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

const mapPhase = (value: bigint | number): RoundPhase => {
    const numeric = typeof value === 'bigint' ? Number(value) : value;
    return PHASE_MAP[numeric] ?? 'sales';
};

const roundInfoFromContract = (payload: any): RoundInfo => {
    const rawWinningNumbers = Array.from(payload.winningNumbers ?? []);
    const normalizedWinningNumbers = rawWinningNumbers
        .map((value: bigint | number) => Number(value))
        .filter((value: number) => Number.isFinite(value) && value > 0);

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

const ticketInfoFromContract = (payload: any): TicketData => ({
    id: BigInt(payload.ticketId ?? 0n).toString(),
    roundId: BigInt(payload.roundId ?? 0n).toString(),
    purchasedAt: Number(payload.purchasedAt ?? 0),
    numbers: Array.from(payload.numbers ?? []).map((value: bigint | number) => Number(value)),
    luckyNumber: Number(payload.luckyNumber ?? 0),
    isAutoPick: Boolean(payload.isAutoPick ?? false),
    tier: Number(payload.tier ?? 0),
    claimed: Boolean(payload.claimed ?? false),
});

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
        const readProvider = signer?.provider ?? provider ?? staticProvider;

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

    const getTicketPrice = useCallback(async () => {
        const contractInstance = contractWithSigner ?? readContract;
        if (!contractInstance) {
            return null;
        }

        try {
            const price: bigint = await contractInstance.ticketPrice();
            return price;
        } catch (error) {
            console.error('Failed to fetch ticket price', error);
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

    const buyTicket = useCallback(
        async (
            numbers: Array<number>,
            luckyNumber: number,
            isAutoPick: boolean,
            tokenURI: string,
        ): Promise<TransactionReceipt | null> => {
            if (!contractWithSigner) {
                throw new Error('Connect your wallet before buying tickets.');
            }

            if (numbers.length !== 6) {
                throw new Error('Exactly 6 numbers are required to buy a ticket.');
            }

            try {
                const ticketPrice = await contractWithSigner.ticketPrice();
                const tx: TransactionResponse = await contractWithSigner.buyTicket(
                    numbers,
                    luckyNumber,
                    isAutoPick,
                    tokenURI,
                    {
                        value: ticketPrice,
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

    const getTicketData = useCallback(
        async (ticketId: number | bigint): Promise<TicketData | null> => {
            if (!readContract) {
                return null;
            }

            try {
                const id = typeof ticketId === 'bigint' ? ticketId : BigInt(ticketId);
                const response = await readContract.getTicketInfo(id);
                return ticketInfoFromContract(response);
            } catch (error) {
                console.error('Failed to fetch ticket data', error);
                return null;
            }
        },
        [readContract],
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
            if (roundId === 0n) {
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
                const args = startTime ? [BigInt(startTime)] : [0n];
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
        ownerAddress,
        currentRoundId,
        isAuthorizedOperator,
        allowedAdminAddresses,
        connectWallet,
        switchToExpectedNetwork,
        getTicketPrice,
        getActiveRound,
        getRoundInfo,
        getTicketData,
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