"use client";

import { useCallback, useEffect, useState } from "react";
import { useLottoV2ContractContext } from "@/hooks/useLottoV2Contract";
import type { RoundInfo } from "@/hooks/useLottoV2Contract";
import { formatUnits } from "ethers";

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

const phaseText = (phase: string) => {
    switch (phase) {
        case 'sales': return '판매중';
        case 'drawing': return '추첨중';
        case 'claimable': return '당첨금 수령 가능';
        default: return phase;
    }
};

export default function AdminPage() {
    const {
        address,
        isAuthorizedOperator,
        currentRoundId,
        getRoundInfo,
        closeCurrentRound,
        startNextRound,
        requestRandomWinningNumbers,
        finalizePayouts,
        autoProgressRound,
    } = useLottoV2ContractContext();

    const [rounds, setRounds] = useState<RoundInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [selectedRound, setSelectedRound] = useState<bigint | null>(null);

    useEffect(() => {
        if (!currentRoundId) return;

        const loadRounds = async () => {
            const roundsData: RoundInfo[] = [];
            const startId = currentRoundId > 10n ? currentRoundId - 9n : 1n;
            
            for (let i = startId; i <= currentRoundId; i++) {
                const info = await getRoundInfo(i);
                if (info) roundsData.push(info);
            }
            
            setRounds(roundsData.reverse());
        };

        loadRounds();
    }, [currentRoundId, getRoundInfo]);

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(null), 4000);
    };

    const handleCloseRound = async () => {
        setLoading(true);
        try {
            await closeCurrentRound();
            showMessage('회차 종료 완료');
            window.location.reload();
        } catch (error: any) {
            showMessage(error.message || '회차 종료 실패');
        } finally {
            setLoading(false);
        }
    };

    const handleStartNextRound = async () => {
        setLoading(true);
        try {
            await startNextRound();
            showMessage('새 회차 시작 완료');
            window.location.reload();
        } catch (error: any) {
            showMessage(error.message || '새 회차 시작 실패');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestRandom = async (roundId: bigint) => {
        setLoading(true);
        try {
            await requestRandomWinningNumbers(roundId);
            showMessage('당첨 번호 요청 완료');
            setTimeout(() => window.location.reload(), 2000);
        } catch (error: any) {
            showMessage(error.message || '당첨 번호 요청 실패');
        } finally {
            setLoading(false);
        }
    };

    const handleFinalizePayouts = async (roundId: bigint) => {
        setLoading(true);
        try {
            await finalizePayouts(roundId);
            showMessage('당첨금 정산 완료');
            window.location.reload();
        } catch (error: any) {
            showMessage(error.message || '당첨금 정산 실패');
        } finally {
            setLoading(false);
        }
    };

    const handleAutoProgress = async () => {
        setLoading(true);
        try {
            await autoProgressRound();
            showMessage('자동 진행 완료');
            window.location.reload();
        } catch (error: any) {
            showMessage(error.message || '자동 진행 실패');
        } finally {
            setLoading(false);
        }
    };

    if (!address) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">지갑을 연결해주세요</h1>
                </div>
            </div>
        );
    }

    if (!isAuthorizedOperator) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">접근 권한이 없습니다</h1>
                    <p className="text-white/80">관리자만 접근할 수 있습니다.</p>
                </div>
            </div>
        );
    }

    const currentRound = rounds.find(r => r.id === currentRoundId);
    const totalTickets = rounds.reduce((sum, r) => sum + Number(r.ticketCount), 0);
    const totalRevenueUSDT = rounds.reduce((sum, r) => sum + Number(formatUnits(r.grossUSDT, 6)), 0);
    const totalRevenueUSDC = rounds.reduce((sum, r) => sum + Number(formatUnits(r.grossUSDC, 6)), 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <header className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white">🎰 관리자 대시보드</h1>
                        <a
                            href="/"
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition"
                        >
                            메인으로
                        </a>
                    </div>
                </header>

                {message && (
                    <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-white text-center">
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                        <div className="text-white/60 text-sm mb-2">총 회차</div>
                        <div className="text-white text-3xl font-bold">{rounds.length}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                        <div className="text-white/60 text-sm mb-2">총 판매 티켓</div>
                        <div className="text-white text-3xl font-bold">{totalTickets.toLocaleString()}장</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                        <div className="text-white/60 text-sm mb-2">총 매출</div>
                        <div className="text-emerald-400 text-2xl font-bold">${totalRevenueUSDT.toFixed(2)}</div>
                        <div className="text-blue-400 text-2xl font-bold">${totalRevenueUSDC.toFixed(2)}</div>
                    </div>
                </div>

                {currentRound && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">현재 회차 관리</h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div>
                                <div className="text-white/60 text-sm mb-1">회차</div>
                                <div className="text-white text-xl font-bold">#{currentRound.id.toString()}</div>
                            </div>
                            <div>
                                <div className="text-white/60 text-sm mb-1">상태</div>
                                <div className="text-white text-xl font-bold">{phaseText(currentRound.phase)}</div>
                            </div>
                            <div>
                                <div className="text-white/60 text-sm mb-1">판매 티켓</div>
                                <div className="text-white text-xl font-bold">{currentRound.ticketCount.toString()}장</div>
                            </div>
                            <div>
                                <div className="text-white/60 text-sm mb-1">종료 시간</div>
                                <div className="text-white text-sm">{formatTime(currentRound.endTime)}</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {currentRound.phase === 'sales' && (
                                <>
                                    <button
                                        onClick={handleAutoProgress}
                                        disabled={loading}
                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white font-semibold rounded-lg transition"
                                    >
                                        자동 진행
                                    </button>
                                    <button
                                        onClick={handleCloseRound}
                                        disabled={loading}
                                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 text-white font-semibold rounded-lg transition"
                                    >
                                        회차 종료
                                    </button>
                                </>
                            )}
                            {currentRound.phase === 'drawing' && (
                                <button
                                    onClick={() => handleRequestRandom(currentRound.id)}
                                    disabled={loading}
                                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white font-semibold rounded-lg transition"
                                >
                                    당첨 번호 추첨
                                </button>
                            )}
                            {currentRound.phase === 'claimable' && !currentRound.payoutsFinalized && (
                                <button
                                    onClick={() => handleFinalizePayouts(currentRound.id)}
                                    disabled={loading}
                                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 text-white font-semibold rounded-lg transition"
                                >
                                    당첨금 정산
                                </button>
                            )}
                            {currentRound.phase === 'claimable' && currentRound.payoutsFinalized && (
                                <button
                                    onClick={handleStartNextRound}
                                    disabled={loading}
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white font-semibold rounded-lg transition"
                                >
                                    다음 회차 시작
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-4">회차 내역</h2>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-white">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-3 px-2">회차</th>
                                    <th className="text-left py-3 px-2">상태</th>
                                    <th className="text-right py-3 px-2">티켓</th>
                                    <th className="text-right py-3 px-2">매출 (USDT)</th>
                                    <th className="text-right py-3 px-2">매출 (USDC)</th>
                                    <th className="text-center py-3 px-2">당첨자</th>
                                    <th className="text-left py-3 px-2">종료 시간</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rounds.map((round) => (
                                    <tr key={round.id.toString()} className="border-b border-white/10 hover:bg-white/5">
                                        <td className="py-3 px-2">#{round.id.toString()}</td>
                                        <td className="py-3 px-2">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                round.phase === 'sales' ? 'bg-green-500' :
                                                round.phase === 'drawing' ? 'bg-yellow-500' :
                                                'bg-blue-500'
                                            }`}>
                                                {phaseText(round.phase)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 text-right">{round.ticketCount.toString()}</td>
                                        <td className="py-3 px-2 text-right">${formatUnits(round.grossUSDT, 6)}</td>
                                        <td className="py-3 px-2 text-right">${formatUnits(round.grossUSDC, 6)}</td>
                                        <td className="py-3 px-2 text-center">
                                            {round.firstWinners > 0 || round.secondWinners > 0 || round.thirdWinners > 0 ? (
                                                <span className="text-xs">
                                                    1등:{round.firstWinners} 2등:{round.secondWinners} 3등:{round.thirdWinners}
                                                </span>
                                            ) : (
                                                <span className="text-white/40">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-2 text-sm">{formatTime(round.endTime)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
