'use client';

import { BrowserProvider, Contract, JsonRpcSigner, TransactionReceipt, TransactionResponse } from 'ethers';
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
    connectWallet: () => Promise<void>;
    switchToExpectedNetwork: () => Promise<void>;
    getTicketPrice: () => Promise<bigint | null>;
    buyTicket: (
        numbers: Array<number>,
        tokenURI: string,
    ) => Promise<TransactionReceipt | null>;
    getTicketData: (ticketId: number | bigint) => Promise<TicketData | null>;
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

export function useLottoContract(): LottoContractContextValue {
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);
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
        ethereum?: {
            on?: (event: string, handler: (...args: any[]) => void) => void;
            removeListener?: (event: string, handler: (...args: any[]) => void) => void;
        };
        };

        if (!ethereum) {
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
            setPendingTransaction(tx.hash);
            const receipt = await tx.wait();
            setPendingTransaction(null);
            return receipt;
        } catch (error) {
            setPendingTransaction(null);
            throw error;
        }
        },
        [contractWithSigner],
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
        connectWallet,
        switchToExpectedNetwork,
        getTicketPrice,
        buyTicket,
        getTicketData,
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