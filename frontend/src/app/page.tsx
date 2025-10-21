"use client";

import { useCallback, useEffect, useState } from "react";
import { useLottoV2ContractContext } from "@/hooks/useLottoV2Contract";
import type { RoundInfo, TicketData } from "@/hooks/useLottoV2Contract";
import { parseUnits, formatUnits } from "ethers";

const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatCountdown = (seconds: number) => {
    if (seconds <= 0) return '종료됨';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}일 ${hours}시간`;
    if (hours > 0) return `${hours}시간 ${minutes}분`;
    return `${minutes}분`;
};

const phaseText = (phase: string) => {
    switch (phase) {
        case 'sales': return '판매중';
        case 'drawing': return '추첨중';
        case 'claimable': return '당첨금 수령 가능';
        default: return phase;
    }
};

export default function LotteryPage() {
    const {
        address,
        isWrongNetwork,
        connectWallet,
        disconnectWallet,
        switchToExpectedNetwork,
        getActiveRound,
        buyTicket,
        buyTickets,
        approveToken,
        getTokenAllowance,
        getTokenBalance,
        claimPrize,
        getTicketData,
        ticketPriceUSD,
        pendingTransaction,
        isWalletAvailable,
    } = useLottoV2ContractContext();

    const [activeRound, setActiveRound] = useState<RoundInfo | null>(null);
    const [useUSDT, setUseUSDT] = useState(true);
    const [ticketCount, setTicketCount] = useState(1);
    const [myTickets, setMyTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<string>('');
    const [tokenBalance, setTokenBalance] = useState<string>('0');
    const [tokenAllowance, setTokenAllowance] = useState<bigint>(0n);

    useEffect(() => {
        const load = async () => {
            const round = await getActiveRound();
            setActiveRound(round);
        };
        load();
    }, [getActiveRound]);

    useEffect(() => {
        if (!activeRound) return;

        const update = () => {
            const now = Math.floor(Date.now() / 1000);
            const remaining = activeRound.endTime - now;
            setCountdown(formatCountdown(remaining));
        };

        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, [activeRound]);

    useEffect(() => {
        if (!address) return;

        const load = async () => {
            const balance = await getTokenBalance(useUSDT);
            setTokenBalance(formatUnits(balance, 6));
            
            const allowance = await getTokenAllowance(useUSDT);
            setTokenAllowance(allowance);
        };
        load();
    }, [address, useUSDT, getTokenBalance, getTokenAllowance]);

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(null), 4000);
    };

    const handleApprove = async () => {
        setLoading(true);
        try {
            const amount = parseUnits((parseFloat(ticketPriceUSD) * ticketCount).toString(), 6);
            await approveToken(useUSDT, amount);
            showMessage('승인 완료!');
            
            const allowance = await getTokenAllowance(useUSDT);
            setTokenAllowance(allowance);
        } catch (error: any) {
            showMessage(error.message || '승인 실패');
        } finally {
            setLoading(false);
        }
    };

    const handleBuyTickets = async () => {
        setLoading(true);
        try {
            const uris = Array(ticketCount).fill('ipfs://placeholder');
            
            if (ticketCount === 1) {
                await buyTicket(useUSDT, uris[0]);
            } else {
                await buyTickets(useUSDT, ticketCount, uris);
            }
            
            showMessage(`${ticketCount}장 구매 완료!`);
            setTicketCount(1);
            
            const round = await getActiveRound();
            setActiveRound(round);
        } catch (error: any) {
            showMessage(error.message || '구매 실패');
        } finally {
            setLoading(false);
        }
    };

    const needsApproval = tokenAllowance < parseUnits((parseFloat(ticketPriceUSD) * ticketCount).toString(), 6);

    if (!isWalletAvailable) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">지갑이 필요합니다</h1>
                    <p className="text-white/80">MetaMask 또는 다른 Web3 지갑을 설치해주세요.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                <header className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white">🎰 럭키 체인</h1>
                        
                        {!address ? (
                            <button
                                onClick={connectWallet}
                                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition"
                            >
                                지갑 연결
                            </button>
                        ) : isWrongNetwork ? (
                            <button
                                onClick={switchToExpectedNetwork}
                                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
                            >
                                네트워크 전환
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="text-white/90 text-sm">
                                    {address.slice(0, 6)}...{address.slice(-4)}
                                </div>
                                <button
                                    onClick={disconnectWallet}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition text-sm"
                                >
                                    연결 해제
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {message && (
                    <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-white text-center">
                        {message}
                    </div>
                )}

                {activeRound && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-4">현재 회차</h2>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <div className="text-white/60 text-sm mb-1">회차 번호</div>
                                    <div className="text-white text-xl font-bold">#{activeRound.id.toString()}</div>
                                </div>
                                <div>
                                    <div className="text-white/60 text-sm mb-1">상태</div>
                                    <div className="text-white text-xl font-bold">{phaseText(activeRound.phase)}</div>
                                </div>
                                <div>
                                    <div className="text-white/60 text-sm mb-1">남은 시간</div>
                                    <div className="text-white text-xl font-bold">{countdown}</div>
                                </div>
                                <div>
                                    <div className="text-white/60 text-sm mb-1">판매된 티켓</div>
                                    <div className="text-white text-xl font-bold">{activeRound.ticketCount.toString()}장</div>
                                </div>
                            </div>

                            <div className="border-t border-white/20 pt-4">
                                <div className="text-white/60 text-sm mb-2">총 상금 풀</div>
                                <div className="flex gap-4">
                                    <div>
                                        <span className="text-emerald-400 font-bold text-lg">
                                            ${formatUnits(activeRound.grossUSDT + activeRound.carryInUSDT, 6)}
                                        </span>
                                        <span className="text-white/60 text-sm ml-2">USDT</span>
                                    </div>
                                    <div>
                                        <span className="text-blue-400 font-bold text-lg">
                                            ${formatUnits(activeRound.grossUSDC + activeRound.carryInUSDC, 6)}
                                        </span>
                                        <span className="text-white/60 text-sm ml-2">USDC</span>
                                    </div>
                                </div>
                            </div>

                            {activeRound.phase === 'claimable' && activeRound.winningNumbers.length > 0 && (
                                <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                                    <div className="text-white font-semibold mb-2">당첨 번호</div>
                                    <div className="flex gap-2 flex-wrap">
                                        {activeRound.winningNumbers.map((num, i) => (
                                            <div key={i} className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-purple-900">
                                                {num}
                                            </div>
                                        ))}
                                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-purple-900">
                                            {activeRound.luckyNumber}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4">티켓 구매</h2>
                            
                            {address && !isWrongNetwork && activeRound.phase === 'sales' ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-white/80 text-sm mb-2 block">결제 토큰</label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setUseUSDT(true)}
                                                className={`flex-1 py-2 rounded-lg font-semibold transition ${
                                                    useUSDT
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                                                }`}
                                            >
                                                USDT
                                            </button>
                                            <button
                                                onClick={() => setUseUSDT(false)}
                                                className={`flex-1 py-2 rounded-lg font-semibold transition ${
                                                    !useUSDT
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                                                }`}
                                            >
                                                USDC
                                            </button>
                                        </div>
                                        <div className="text-white/60 text-xs mt-2">
                                            잔액: ${tokenBalance}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-white/80 text-sm mb-2 block">티켓 수량</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="50"
                                            value={ticketCount}
                                            onChange={(e) => setTicketCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                                        />
                                    </div>

                                    <div className="p-3 bg-white/5 rounded-lg">
                                        <div className="flex justify-between text-white/80 text-sm mb-1">
                                            <span>티켓 가격</span>
                                            <span>${ticketPriceUSD}</span>
                                        </div>
                                        <div className="flex justify-between text-white font-bold">
                                            <span>총 금액</span>
                                            <span>${(parseFloat(ticketPriceUSD) * ticketCount).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {needsApproval ? (
                                        <button
                                            onClick={handleApprove}
                                            disabled={loading || !!pendingTransaction}
                                            className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-white font-semibold rounded-lg transition"
                                        >
                                            {loading || pendingTransaction ? '처리중...' : '토큰 승인'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleBuyTickets}
                                            disabled={loading || !!pendingTransaction}
                                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 text-white font-semibold rounded-lg transition"
                                        >
                                            {loading || pendingTransaction ? '처리중...' : '구매하기'}
                                        </button>
                                    )}

                                    <div className="text-white/60 text-xs text-center">
                                        번호는 자동으로 생성됩니다
                                    </div>
                                </div>
                            ) : (
                                <div className="text-white/60 text-center py-8">
                                    {!address ? '지갑을 연결해주세요' : 
                                     isWrongNetwork ? '네트워크를 전환해주세요' :
                                     '판매가 종료되었습니다'}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-4">내 티켓</h2>
                    {myTickets.length === 0 ? (
                        <div className="text-white/60 text-center py-8">
                            구매한 티켓이 없습니다
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {myTickets.map((ticket) => (
                                <div key={ticket.id} className="bg-white/5 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="text-white/60 text-sm">티켓 #{ticket.id}</div>
                                        <div className={`px-2 py-1 rounded text-xs font-semibold ${
                                            ticket.claimed ? 'bg-gray-500' : 
                                            ticket.tier > 0 ? 'bg-yellow-500' : 'bg-blue-500'
                                        }`}>
                                            {ticket.claimed ? '수령완료' : ticket.tier > 0 ? `${ticket.tier}등` : '미당첨'}
                                        </div>
                                    </div>
                                    <div className="flex gap-1 flex-wrap mb-3">
                                        {ticket.numbers.map((num, i) => (
                                            <div key={i} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                {num}
                                            </div>
                                        ))}
                                        <div className="w-8 h-8 bg-yellow-400/50 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                            {ticket.luckyNumber}
                                        </div>
                                    </div>
                                    {ticket.tier > 0 && !ticket.claimed && (
                                        <button
                                            onClick={() => claimPrize(BigInt(ticket.id))}
                                            className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded transition"
                                        >
                                            당첨금 수령
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
