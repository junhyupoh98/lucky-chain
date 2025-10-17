'use client';

import {
    BrowserProvider,
    Contract,
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

export type TicketData = {
    id: string;
    drawId: string;
    purchasedAt: number;
    numbers: number[];
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
    currentDrawId: bigint | null;
    isAuthorizedOperator: boolean;
    allowedAdminAddresses: string[];
    connectWallet: () => Promise<void>;
    switchToExpectedNetwork: () => Promise<void>;
    getTicketPrice: () => Promise<bigint | null>;
    buyTicket: (
        numbers: Array<number>,
        tokenURI: string,
    ) => Promise<TransactionReceipt | null>;
    getTicketData: (ticketId: number | bigint) => Promise<TicketData | null>;
    createOrUpdateDraw: (
        drawId: number,
        drawTimestamp: number,
        isOpenForSale: boolean,
    ) => Promise<TransactionReceipt>;
    setCurrentDraw: (drawId: number) => Promise<TransactionReceipt>;
    requestRandomWinningNumbers: (drawId: number) => Promise<TransactionReceipt>;
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

const normalizeAddress = (value: string | null | undefined) =>
    (value ? value.toLowerCase() : null);

export function useLottoContract(): LottoContractContextValue {
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);
    const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
    const [currentDrawId, setCurrentDrawId] = useState<bigint | null>(null);
    const [isWalletAvailable, setIsWalletAvailable] = useState<boolean>(true);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [pendingTransaction, setPendingTransaction] = useState<string | null>(null);

    const expectedChainId = useMemo(() => getExpectedChainId(), []);
    const expectedChainHex = useMemo(
        () => `0x${expectedChainId.toString(16)}` as `0x${string}`,
        [expectedChainId],
    );

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
        if (!provider || !CONTRACT_ADDRESS) {
            return null;
        }

        return new Contract(CONTRACT_ADDRESS, lottoAbi, provider);
    }, [provider]);

    useEffect(() => {
        if (!readContract) {
            setOwnerAddress(null);
            setCurrentDrawId(null);
            return;
        }

        let cancelled = false;

        const loadContractState = async () => {
            try {
                const [owner, currentDraw] = await Promise.all([
                    readContract.owner(),
                    readContract.currentDrawId(),
                ]);
                if (!cancelled) {
                    setOwnerAddress(owner as string);
                    setCurrentDrawId(currentDraw as bigint);
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
        async (numbers: Array<number>, tokenURI: string): Promise<TransactionReceipt | null> => {
            if (!contractWithSigner) {
                throw new Error('Connect your wallet before buying tickets.');
            }

            if (numbers.length !== 6) {
                throw new Error('Exactly 6 numbers are required to buy a ticket.');
            }

            try {
                const ticketPrice = await contractWithSigner.ticketPrice();
                const tx: TransactionResponse = await contractWithSigner.buyTicket(numbers, tokenURI, {
                    value: ticketPrice,
                });
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
                const [timestamp, drawId] = await Promise.all([
                    readContract.purchaseTimestamps(id),
                    readContract.ticketToDraw(id),
                ]);

                const numbers = await Promise.all(
                    Array.from({ length: 6 }, (_, index) => readContract.ticketNumbers(id, index)),
                );

                return {
                    id: id.toString(),
                    drawId: drawId.toString(),
                    purchasedAt: Number(timestamp),
                    numbers: numbers.map((value) => Number(value)),
                };
            } catch (error) {
                console.error('Failed to fetch ticket data', error);
                return null;
            }
        },
        [readContract],
    );

    const createOrUpdateDraw = useCallback(
        async (drawId: number, drawTimestamp: number, isOpenForSale: boolean) => {
            const contractInstance = requireAuthorizedSigner();

            if (!Number.isInteger(drawId) || drawId < 0) {
                throw new Error('Draw ID must be a non-negative integer.');
            }

            if (!Number.isInteger(drawTimestamp) || drawTimestamp <= 0) {
                throw new Error('Draw timestamp must be a positive Unix timestamp.');
            }

            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (drawTimestamp <= currentTimestamp) {
                throw new Error('Draw timestamp must be in the future.');
            }

            try {
                const tx: TransactionResponse = await contractInstance.createOrUpdateDraw(
                    BigInt(drawId),
                    BigInt(drawTimestamp),
                    isOpenForSale,
                );
                updatePending(tx.hash);
                const receipt = await tx.wait();
                updatePending(null);
                if (!receipt) {
                    throw new Error('Transaction could not be confirmed.');
                }
                return receipt;
            } catch (error) {
                updatePending(null);
                throw error;
            }
        },
        [requireAuthorizedSigner, updatePending],
    );

    const setCurrentDraw = useCallback(
        async (drawId: number) => {
            const contractInstance = requireAuthorizedSigner();

            if (!Number.isInteger(drawId) || drawId < 0) {
                throw new Error('Draw ID must be a non-negative integer.');
            }

            try {
                const tx: TransactionResponse = await contractInstance.setCurrentDraw(BigInt(drawId));
                updatePending(tx.hash);
                const receipt = await tx.wait();
                updatePending(null);
                if (!receipt) {
                    throw new Error('Transaction could not be confirmed.');
                }
                setCurrentDrawId(BigInt(drawId));
                return receipt;
            } catch (error) {
                updatePending(null);
                throw error;
            }
        },
        [requireAuthorizedSigner, updatePending],
    );

    const requestRandomWinningNumbers = useCallback(
        async (drawId: number) => {
            const contractInstance = requireAuthorizedSigner();

            if (!Number.isInteger(drawId) || drawId < 0) {
                throw new Error('Draw ID must be a non-negative integer.');
            }

            if (currentDrawId !== null && BigInt(drawId) >= currentDrawId) {
                throw new Error('Draw ID must reference a completed draw.');
            }

            try {
                const tx: TransactionResponse = await contractInstance.requestRandomWinningNumbers(
                    BigInt(drawId),
                );
                updatePending(tx.hash);
                const receipt = await tx.wait();
                updatePending(null);
                if (!receipt) {
                    throw new Error('Transaction could not be confirmed.');
                }
                return receipt;
            } catch (error) {
                updatePending(null);
                throw error;
            }
        },
        [currentDrawId, requireAuthorizedSigner, updatePending],
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
        currentDrawId,
        isAuthorizedOperator,
        allowedAdminAddresses,
        connectWallet,
        switchToExpectedNetwork,
        getTicketPrice,
        buyTicket,
        getTicketData,
        createOrUpdateDraw,
        setCurrentDraw,
        requestRandomWinningNumbers,
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