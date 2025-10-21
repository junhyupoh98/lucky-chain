'use client';

import {
    BrowserProvider,
    Contract,
    JsonRpcProvider,
    JsonRpcSigner,
    TransactionReceipt,
    formatUnits,
    parseUnits,
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

const PHASE_MAP: Record<number, RoundPhase> = {
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
    isUSDT: boolean;
    tier: number;
    claimed: boolean;
    tokenURI: string | null;
};

export type RoundInfo = {
    id: bigint;
    startTime: number;
    endTime: number;
    phase: RoundPhase;
    ticketCount: bigint;
    grossUSDT: bigint;
    grossUSDC: bigint;
    carryInUSDT: bigint;
    carryInUSDC: bigint;
    carryOutUSDT: bigint;
    carryOutUSDC: bigint;
    winningNumbers: number[];
    luckyNumber: number | null;
    firstWinners: number;
    secondWinners: number;
    thirdWinners: number;
    pFirstUSDT: bigint;
    pSecondUSDT: bigint;
    pThirdUSDT: bigint;
    pFirstUSDC: bigint;
    pSecondUSDC: bigint;
    pThirdUSDC: bigint;
    payoutsFinalized: boolean;
};

export type LottoV2ContractContextValue = {
    provider: BrowserProvider | null;
    signer: JsonRpcSigner | null;
    address: string | null;
    chainId: number | null;
    expectedChainId: number;
    isWrongNetwork: boolean;
    isConnecting: boolean;
    isWalletAvailable: boolean;
    pendingTransaction: string | null;
    ticketPriceUSD: string;
    ownerAddress: string | null;
    currentRoundId: bigint | null;
    isAuthorizedOperator: boolean;
    usdtAddress: string | null;
    usdcAddress: string | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => Promise<void>;
    switchToExpectedNetwork: () => Promise<void>;
    getActiveRound: () => Promise<RoundInfo | null>;
    getRoundInfo: (roundId: number | bigint) => Promise<RoundInfo | null>;
    getTicketData: (ticketId: number | bigint) => Promise<TicketData | null>;
    buyTicket: (useUSDT: boolean, tokenURI: string) => Promise<TransactionReceipt | null>;
    buyTickets: (useUSDT: boolean, count: number, tokenURIs: string[]) => Promise<TransactionReceipt | null>;
    claimPrize: (ticketId: number | bigint) => Promise<TransactionReceipt | null>;
    approveToken: (useUSDT: boolean, amount: bigint) => Promise<TransactionReceipt | null>;
    getTokenAllowance: (useUSDT: boolean) => Promise<bigint>;
    getTokenBalance: (useUSDT: boolean) => Promise<bigint>;
    closeCurrentRound: () => Promise<TransactionReceipt | null>;
    startNextRound: (startTime?: number) => Promise<TransactionReceipt | null>;
    requestRandomWinningNumbers: (roundId: number | bigint) => Promise<TransactionReceipt | null>;
    finalizePayouts: (roundId: number | bigint) => Promise<TransactionReceipt | null>;
    autoProgressRound: () => Promise<TransactionReceipt | null>;
};

const DEFAULT_CHAIN_ID = 1001;
const DEFAULT_RPC_URL = 'https://public-en-kairos.node.kaia.io';
const CHAIN_NAME = 'Kaia Kairos Testnet';
const TICKET_PRICE_USD = '1.00';

const getExpectedChainId = () => contractConfig.chainId ?? DEFAULT_CHAIN_ID;
const getExpectedRpcUrl = () => contractConfig.rpcUrl ?? DEFAULT_RPC_URL;
const CONTRACT_ADDRESS = contractConfig.address;

const allowedAdminAddresses = (staticAllowedAdmins ?? [])
    .map((value) => (typeof value === 'string' ? value.toLowerCase() : ''))
    .filter((value) => value);

const normalizeAddress = (value: string | null | undefined) =>
    (value ? value.toLowerCase() : null);

const ERC20_ABI = [
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function balanceOf(address account) view returns (uint256)',
];

const LottoV2Context = createContext<LottoV2ContractContextValue | null>(null);

function useLottoV2Contract(): LottoV2ContractContextValue {
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [pendingTransaction, setPendingTransaction] = useState<string | null>(null);
    const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
    const [currentRoundId, setCurrentRoundId] = useState<bigint | null>(null);
    const [usdtAddress, setUsdtAddress] = useState<string | null>(null);
    const [usdcAddress, setUsdcAddress] = useState<string | null>(null);

    const expectedChainId = useMemo(() => getExpectedChainId(), []);
    const expectedChainHex = useMemo(() => `0x${expectedChainId.toString(16)}` as `0x${string}`, [expectedChainId]);

    const staticProvider = useMemo(() => {
        try {
            return new JsonRpcProvider(getExpectedRpcUrl());
        } catch {
            return null;
        }
    }, []);

    const isWalletAvailable = typeof window !== 'undefined' && 'ethereum' in window;

    useEffect(() => {
        if (!isWalletAvailable) return;

        const { ethereum } = window as any;

        const refreshAccountState = async () => {
            try {
                const browserProvider = new BrowserProvider(ethereum as Eip1193Provider);
                const accounts = await browserProvider.listAccounts();
                
                if (accounts.length > 0) {
                    const currentSigner = await browserProvider.getSigner();
                    const currentAddress = await currentSigner.getAddress();
                    const network = await browserProvider.getNetwork();
                    
                    setProvider(browserProvider);
                    setSigner(currentSigner);
                    setAddress(currentAddress);
                    setChainId(Number(network.chainId));
                } else {
                    setProvider(null);
                    setSigner(null);
                    setAddress(null);
                    setChainId(null);
                }
            } catch (error) {
                console.error('Failed to refresh account state', error);
            }
        };

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                setProvider(null);
                setSigner(null);
                setAddress(null);
            } else {
                void refreshAccountState();
            }
        };

        const handleChainChanged = () => {
            void refreshAccountState();
        };

        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('chainChanged', handleChainChanged);

        void refreshAccountState();

        return () => {
            ethereum.removeListener('accountsChanged', handleAccountsChanged);
            ethereum.removeListener('chainChanged', handleChainChanged);
        };
    }, [isWalletAvailable]);

    const connectWallet = useCallback(async () => {
        if (!isWalletAvailable) {
            throw new Error('지갑을 사용할 수 없습니다');
        }

        setIsConnecting(true);
        try {
            const { ethereum } = window as any;
            await ethereum.request({ method: 'eth_requestAccounts' });
        } finally {
            setIsConnecting(false);
        }
    }, [isWalletAvailable]);

    const disconnectWallet = useCallback(async () => {
        setProvider(null);
        setSigner(null);
        setAddress(null);
        setChainId(null);
    }, []);

    const isWrongNetwork = useMemo(
        () => chainId != null && chainId !== expectedChainId,
        [chainId, expectedChainId]
    );

    const switchToExpectedNetwork = useCallback(async () => {
        if (!isWalletAvailable) return;

        const { ethereum } = window as any;
        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: expectedChainHex }],
            });
        } catch (error: any) {
            if (error.code === 4902) {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: expectedChainHex,
                        chainName: CHAIN_NAME,
                        rpcUrls: [getExpectedRpcUrl()],
                    }],
                });
            } else {
                throw error;
            }
        }
    }, [isWalletAvailable, expectedChainHex]);

    const contractWithSigner = useMemo(() => {
        if (!signer || !CONTRACT_ADDRESS) return null;
        return new Contract(CONTRACT_ADDRESS, lottoAbi, signer);
    }, [signer]);

    const readContract = useMemo(() => {
        const providerToUse = provider || staticProvider;
        if (!providerToUse || !CONTRACT_ADDRESS) return null;
        return new Contract(CONTRACT_ADDRESS, lottoAbi, providerToUse);
    }, [provider, staticProvider]);

    useEffect(() => {
        if (!readContract) return;

        const loadContractState = async () => {
            try {
                const [owner, roundId, usdt, usdc] = await Promise.all([
                    readContract.owner(),
                    readContract.currentRoundId(),
                    readContract.usdt(),
                    readContract.usdc(),
                ]);
                setOwnerAddress(normalizeAddress(owner));
                setCurrentRoundId(roundId);
                setUsdtAddress(usdt);
                setUsdcAddress(usdc);
            } catch (error) {
                console.error('Failed to load contract state', error);
            }
        };

        void loadContractState();
    }, [readContract]);

    const getActiveRound = useCallback(async (): Promise<RoundInfo | null> => {
        if (!readContract || !currentRoundId) return null;
        return getRoundInfo(currentRoundId);
    }, [readContract, currentRoundId]);

    const getRoundInfo = useCallback(async (roundId: number | bigint): Promise<RoundInfo | null> => {
        if (!readContract) return null;

        try {
            const info = await readContract.getRoundInfo(roundId);
            return {
                id: info.id,
                startTime: Number(info.startTime),
                endTime: Number(info.endTime),
                phase: PHASE_MAP[Number(info.phase)] || 'sales',
                ticketCount: info.ticketCount,
                grossUSDT: info.grossUSDT,
                grossUSDC: info.grossUSDC,
                carryInUSDT: info.carryInUSDT,
                carryInUSDC: info.carryInUSDC,
                carryOutUSDT: info.carryOutUSDT,
                carryOutUSDC: info.carryOutUSDC,
                winningNumbers: info.winningNumbers.map((n: any) => Number(n)),
                luckyNumber: Number(info.luckyNumber) || null,
                firstWinners: Number(info.firstWinners),
                secondWinners: Number(info.secondWinners),
                thirdWinners: Number(info.thirdWinners),
                pFirstUSDT: info.pFirstUSDT,
                pSecondUSDT: info.pSecondUSDT,
                pThirdUSDT: info.pThirdUSDT,
                pFirstUSDC: info.pFirstUSDC,
                pSecondUSDC: info.pSecondUSDC,
                pThirdUSDC: info.pThirdUSDC,
                payoutsFinalized: info.payoutsFinalized,
            };
        } catch (error) {
            console.error('Failed to get round info', error);
            return null;
        }
    }, [readContract]);

    const getTicketData = useCallback(async (ticketId: number | bigint): Promise<TicketData | null> => {
        if (!readContract) return null;

        try {
            const info = await readContract.getTicketInfo(ticketId);
            const uri = await readContract.tokenURI(ticketId);
            
            return {
                id: info.ticketId.toString(),
                roundId: info.roundId.toString(),
                purchasedAt: Number(info.purchasedAt),
                numbers: info.numbers.map((n: any) => Number(n)),
                luckyNumber: Number(info.luckyNumber),
                isUSDT: info.isUSDT,
                tier: Number(info.tier),
                claimed: info.claimed,
                tokenURI: uri || null,
            };
        } catch (error) {
            console.error('Failed to get ticket data', error);
            return null;
        }
    }, [readContract]);

    const approveToken = useCallback(async (useUSDT: boolean, amount: bigint): Promise<TransactionReceipt | null> => {
        if (!signer || !CONTRACT_ADDRESS) throw new Error('지갑이 연결되지 않았습니다');
        
        const tokenAddress = useUSDT ? usdtAddress : usdcAddress;
        if (!tokenAddress) throw new Error('토큰 주소를 찾을 수 없습니다');

        const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer);
        const tx = await tokenContract.approve(CONTRACT_ADDRESS, amount);
        setPendingTransaction(tx.hash);
        const receipt = await tx.wait();
        setPendingTransaction(null);
        return receipt;
    }, [signer, usdtAddress, usdcAddress]);

    const getTokenAllowance = useCallback(async (useUSDT: boolean): Promise<bigint> => {
        if (!provider || !address) return 0n;
        
        const tokenAddress = useUSDT ? usdtAddress : usdcAddress;
        if (!tokenAddress || !CONTRACT_ADDRESS) return 0n;

        const tokenContract = new Contract(tokenAddress, ERC20_ABI, provider);
        return await tokenContract.allowance(address, CONTRACT_ADDRESS);
    }, [provider, address, usdtAddress, usdcAddress]);

    const getTokenBalance = useCallback(async (useUSDT: boolean): Promise<bigint> => {
        if (!provider || !address) return 0n;
        
        const tokenAddress = useUSDT ? usdtAddress : usdcAddress;
        if (!tokenAddress) return 0n;

        const tokenContract = new Contract(tokenAddress, ERC20_ABI, provider);
        return await tokenContract.balanceOf(address);
    }, [provider, address, usdtAddress, usdcAddress]);

    const buyTicket = useCallback(async (useUSDT: boolean, tokenURI: string): Promise<TransactionReceipt | null> => {
        if (!contractWithSigner) throw new Error('지갑이 연결되지 않았습니다');

        const tx = await contractWithSigner.buyTicket(useUSDT, tokenURI);
        setPendingTransaction(tx.hash);
        const receipt = await tx.wait();
        setPendingTransaction(null);
        return receipt;
    }, [contractWithSigner]);

    const buyTickets = useCallback(async (useUSDT: boolean, count: number, tokenURIs: string[]): Promise<TransactionReceipt | null> => {
        if (!contractWithSigner) throw new Error('지갑이 연결되지 않았습니다');

        const tx = await contractWithSigner.buyTickets(useUSDT, count, tokenURIs);
        setPendingTransaction(tx.hash);
        const receipt = await tx.wait();
        setPendingTransaction(null);
        return receipt;
    }, [contractWithSigner]);

    const claimPrize = useCallback(async (ticketId: number | bigint): Promise<TransactionReceipt | null> => {
        if (!contractWithSigner) throw new Error('지갑이 연결되지 않았습니다');

        const tx = await contractWithSigner.claimPrize(ticketId);
        setPendingTransaction(tx.hash);
        const receipt = await tx.wait();
        setPendingTransaction(null);
        return receipt;
    }, [contractWithSigner]);

    const closeCurrentRound = useCallback(async (): Promise<TransactionReceipt | null> => {
        if (!contractWithSigner) throw new Error('지갑이 연결되지 않았습니다');

        const tx = await contractWithSigner.closeCurrentRound();
        setPendingTransaction(tx.hash);
        const receipt = await tx.wait();
        setPendingTransaction(null);
        return receipt;
    }, [contractWithSigner]);

    const startNextRound = useCallback(async (startTime?: number): Promise<TransactionReceipt | null> => {
        if (!contractWithSigner) throw new Error('지갑이 연결되지 않았습니다');

        const tx = await contractWithSigner.startNextRound(startTime || 0);
        setPendingTransaction(tx.hash);
        const receipt = await tx.wait();
        setPendingTransaction(null);
        return receipt;
    }, [contractWithSigner]);

    const requestRandomWinningNumbers = useCallback(async (roundId: number | bigint): Promise<TransactionReceipt | null> => {
        if (!contractWithSigner) throw new Error('지갑이 연결되지 않았습니다');

        const tx = await contractWithSigner.requestRandomWinningNumbers(roundId);
        setPendingTransaction(tx.hash);
        const receipt = await tx.wait();
        setPendingTransaction(null);
        return receipt;
    }, [contractWithSigner]);

    const finalizePayouts = useCallback(async (roundId: number | bigint): Promise<TransactionReceipt | null> => {
        if (!contractWithSigner) throw new Error('지갑이 연결되지 않았습니다');

        const tx = await contractWithSigner.finalizePayouts(roundId);
        setPendingTransaction(tx.hash);
        const receipt = await tx.wait();
        setPendingTransaction(null);
        return receipt;
    }, [contractWithSigner]);

    const autoProgressRound = useCallback(async (): Promise<TransactionReceipt | null> => {
        if (!contractWithSigner) throw new Error('지갑이 연결되지 않았습니다');

        const tx = await contractWithSigner.autoProgressRound();
        setPendingTransaction(tx.hash);
        const receipt = await tx.wait();
        setPendingTransaction(null);
        return receipt;
    }, [contractWithSigner]);

    const isAuthorizedOperator = useMemo(() => {
        const normalized = normalizeAddress(address);
        const normalizedOwner = normalizeAddress(ownerAddress);
        return (
            normalized != null &&
            (normalized === normalizedOwner || allowedAdminAddresses.includes(normalized))
        );
    }, [address, ownerAddress]);

    return {
        provider,
        signer,
        address,
        chainId,
        expectedChainId,
        isWrongNetwork,
        isConnecting,
        isWalletAvailable,
        pendingTransaction,
        ticketPriceUSD: TICKET_PRICE_USD,
        ownerAddress,
        currentRoundId,
        isAuthorizedOperator,
        usdtAddress,
        usdcAddress,
        connectWallet,
        disconnectWallet,
        switchToExpectedNetwork,
        getActiveRound,
        getRoundInfo,
        getTicketData,
        buyTicket,
        buyTickets,
        claimPrize,
        approveToken,
        getTokenAllowance,
        getTokenBalance,
        closeCurrentRound,
        startNextRound,
        requestRandomWinningNumbers,
        finalizePayouts,
        autoProgressRound,
    };
}

export function useLottoV2ContractContext() {
    const context = useContext(LottoV2Context);
    if (!context) {
        throw new Error('useLottoV2ContractContext must be used within LottoV2ContractProvider');
    }
    return context;
}

export function LottoV2ContractProvider({ children }: { children: ReactNode }) {
    const value = useLottoV2Contract();
    return <LottoV2Context.Provider value={value}>{children}</LottoV2Context.Provider>;
}
