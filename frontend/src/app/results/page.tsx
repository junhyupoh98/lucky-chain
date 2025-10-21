"use client";

import { useEffect, useState } from "react";
import { useLottoV2ContractContext } from "@/hooks/useLottoV2Contract";
import type { RoundInfo, TicketData } from "@/hooks/useLottoV2Contract";
import { formatUnits } from "ethers";
import BottomNav from "@/components/BottomNav";
import { Trophy, Clock, Award } from "lucide-react";

const formatTime = (seconds: number) => {
  const date = new Date(seconds * 1000);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ResultsPage() {
  const {
    address,
    isWrongNetwork,
    connectWallet,
    switchToExpectedNetwork,
    getActiveRound,
    claimPrize,
    getTicketData,
    pendingTransaction,
    isWalletAvailable,
  } = useLottoV2ContractContext();

  const [rounds, setRounds] = useState<RoundInfo[]>([]);
  const [myTickets, setMyTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [expandedRound, setExpandedRound] = useState<bigint | null>(null);

  useEffect(() => {
    const load = async () => {
      const currentRound = await getActiveRound();
      if (currentRound) {
        setRounds([currentRound]);
      }
    };
    load();
  }, [getActiveRound]);

  useEffect(() => {
    if (!address) return;

    const loadTickets = async () => {
    };
    loadTickets();
  }, [address]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 4000);
  };

  const handleClaim = async (ticketId: bigint) => {
    setLoading(true);
    try {
      await claimPrize(ticketId);
      showMessage("당첨금 수령 완료!");
      
      if (address) {
      }
    } catch (error: any) {
      showMessage(error.message || "수령 실패");
    } finally {
      setLoading(false);
    }
  };

  const getTierText = (tier: number) => {
    switch (tier) {
      case 1:
        return "1등";
      case 2:
        return "2등";
      case 3:
        return "3등";
      default:
        return "미당첨";
    }
  };

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1:
        return "bg-yellow-500";
      case 2:
        return "bg-gray-400";
      case 3:
        return "bg-orange-600";
      default:
        return "bg-blue-500";
    }
  };

  if (!isWalletAvailable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            지갑이 필요합니다
          </h1>
          <p className="text-white/80">
            MetaMask 또는 다른 Web3 지갑을 설치해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-8 h-8" />
            추첨 결과
          </h1>
        </header>

        {message && (
          <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-white text-center">
            {message}
          </div>
        )}

        {!address ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
            <p className="text-white/80 mb-4">
              결과를 확인하려면 지갑을 연결해주세요
            </p>
            <button
              onClick={connectWallet}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition"
            >
              지갑 연결
            </button>
          </div>
        ) : isWrongNetwork ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
            <p className="text-white/80 mb-4">올바른 네트워크로 전환해주세요</p>
            <button
              onClick={switchToExpectedNetwork}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
            >
              네트워크 전환
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {rounds.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
                <p className="text-white/60">아직 종료된 라운드가 없습니다</p>
              </div>
            ) : (
              rounds.map((round) => (
                <div
                  key={round.id.toString()}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden"
                >
                  <div
                    className="p-6 cursor-pointer hover:bg-white/5 transition"
                    onClick={() =>
                      setExpandedRound(
                        expandedRound === round.id ? null : round.id
                      )
                    }
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                          회차 #{round.id.toString()}
                        </h2>
                        <div className="flex items-center gap-2 text-white/60 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(round.endTime)}</span>
                        </div>
                      </div>
                      <div
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          round.phase === "claimable"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : round.phase === "drawing"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {round.phase === "claimable"
                          ? "수령 가능"
                          : round.phase === "drawing"
                          ? "추첨중"
                          : "판매중"}
                      </div>
                    </div>

                    {round.phase === "claimable" &&
                      round.winningNumbers.length > 0 && (
                        <div className="mb-4">
                          <div className="text-white/60 text-sm mb-2">
                            당첨 번호
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {round.winningNumbers.map((num, i) => (
                              <div
                                key={i}
                                className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-purple-900 text-lg"
                              >
                                {num}
                              </div>
                            ))}
                            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-purple-900 text-lg">
                              {round.luckyNumber}
                            </div>
                          </div>
                        </div>
                      )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <div className="text-white/60 text-sm mb-1">
                          총 상금
                        </div>
                        <div className="text-white font-bold">
                          $
                          {(
                            Number(
                              formatUnits(
                                round.grossUSDT + round.carryInUSDT,
                                6
                              )
                            ) +
                            Number(
                              formatUnits(
                                round.grossUSDC + round.carryInUSDC,
                                6
                              )
                            )
                          ).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60 text-sm mb-1">
                          참가자
                        </div>
                        <div className="text-white font-bold">
                          {round.ticketCount.toString()}명
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60 text-sm mb-1">
                          1등 당첨자
                        </div>
                        <div className="text-yellow-400 font-bold">
                          {round.firstWinners}명
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60 text-sm mb-1">
                          2/3등 당첨자
                        </div>
                        <div className="text-blue-400 font-bold">
                          {round.secondWinners + round.thirdWinners}명
                        </div>
                      </div>
                    </div>
                  </div>

                  {expandedRound === round.id && (
                    <div className="border-t border-white/20 p-6 bg-white/5">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        상금 정보
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              1
                            </div>
                            <span className="text-white font-semibold">
                              1등
                            </span>
                          </div>
                          <div className="text-white/60 text-sm mb-1">
                            USDT: $
                            {Number(
                              formatUnits(round.pFirstUSDT || 0n, 6)
                            ).toFixed(2)}
                          </div>
                          <div className="text-white/60 text-sm">
                            USDC: $
                            {Number(
                              formatUnits(round.pFirstUSDC || 0n, 6)
                            ).toFixed(2)}
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              2
                            </div>
                            <span className="text-white font-semibold">
                              2등
                            </span>
                          </div>
                          <div className="text-white/60 text-sm mb-1">
                            USDT: $
                            {Number(
                              formatUnits(round.pSecondUSDT || 0n, 6)
                            ).toFixed(2)}
                          </div>
                          <div className="text-white/60 text-sm">
                            USDC: $
                            {Number(
                              formatUnits(round.pSecondUSDC || 0n, 6)
                            ).toFixed(2)}
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              3
                            </div>
                            <span className="text-white font-semibold">
                              3등
                            </span>
                          </div>
                          <div className="text-white/60 text-sm mb-1">
                            USDT: $
                            {Number(
                              formatUnits(round.pThirdUSDT || 0n, 6)
                            ).toFixed(2)}
                          </div>
                          <div className="text-white/60 text-sm">
                            USDC: $
                            {Number(
                              formatUnits(round.pThirdUSDC || 0n, 6)
                            ).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* Show user's winning tickets for this round */}
                      {myTickets.filter(
                        (t) => t.roundId === round.id && t.tier > 0
                      ).length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-white font-semibold mb-3">
                            내 당첨 티켓
                          </h4>
                          <div className="space-y-3">
                            {myTickets
                              .filter(
                                (t) => t.roundId === round.id && t.tier > 0
                              )
                              .map((ticket) => (
                                <div
                                  key={ticket.id}
                                  className="bg-white/5 rounded-lg p-4 flex justify-between items-center"
                                >
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <div
                                        className={`px-3 py-1 rounded-full text-white font-bold text-sm ${getTierColor(
                                          ticket.tier
                                        )}`}
                                      >
                                        {getTierText(ticket.tier)}
                                      </div>
                                      <span className="text-white/60 text-sm">
                                        티켓 #{ticket.id}
                                      </span>
                                    </div>
                                    <div className="flex gap-1">
                                      {ticket.numbers.map((num, i) => (
                                        <div
                                          key={i}
                                          className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                                        >
                                          {num}
                                        </div>
                                      ))}
                                      <div className="w-8 h-8 bg-yellow-400/50 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                        {ticket.luckyNumber}
                                      </div>
                                    </div>
                                  </div>
                                  {!ticket.claimed && (
                                    <button
                                      onClick={() =>
                                        handleClaim(BigInt(ticket.id))
                                      }
                                      disabled={loading || !!pendingTransaction}
                                      className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 text-white font-semibold rounded-lg transition"
                                    >
                                      {loading || pendingTransaction
                                        ? "처리중..."
                                        : "수령하기"}
                                    </button>
                                  )}
                                  {ticket.claimed && (
                                    <div className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg">
                                      수령완료
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <BottomNav isAdmin={false} />
    </div>
  );
}
