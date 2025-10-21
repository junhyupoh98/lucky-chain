"use client";

import { useEffect, useState } from "react";
import { useLottoV2ContractContext } from "@/hooks/useLottoV2Contract";
import type { RoundInfo } from "@/hooks/useLottoV2Contract";
import { formatUnits } from "ethers";
import BottomNav from "@/components/BottomNav";
import { Clock, Users, DollarSign } from "lucide-react";

const formatCountdown = (seconds: number) => {
  if (seconds <= 0) return "종료됨";

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) return `${days}일 ${hours}시간 ${minutes}분`;
  if (hours > 0) return `${hours}시간 ${minutes}분 ${secs}초`;
  return `${minutes}분 ${secs}초`;
};

export default function HomePage() {
  const {
    address,
    isWrongNetwork,
    connectWallet,
    switchToExpectedNetwork,
    getActiveRound,
    isWalletAvailable,
  } = useLottoV2ContractContext();

  const [activeRound, setActiveRound] = useState<RoundInfo | null>(null);
  const [countdown, setCountdown] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

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
      setTimeRemaining(remaining);
      setCountdown(formatCountdown(remaining));
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [activeRound]);

  const totalPrizeUSDT = activeRound
    ? Number(formatUnits(activeRound.grossUSDT + activeRound.carryInUSDT, 6))
    : 0;
  const totalPrizeUSDC = activeRound
    ? Number(formatUnits(activeRound.grossUSDC + activeRound.carryInUSDC, 6))
    : 0;
  const totalPrize = totalPrizeUSDT + totalPrizeUSDC;

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
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              🎰 럭키 체인
            </h1>

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
              </div>
            )}
          </div>
        </header>

        {activeRound && (
          <div className="space-y-6">
            {/* 총 상금 카드 */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-3xl p-8 border border-yellow-500/30">
              <div className="text-center">
                <div className="text-white/80 text-lg mb-2">총 상금</div>
                <div className="text-5xl sm:text-6xl font-bold text-white mb-4">
                  ${totalPrize.toLocaleString("ko-KR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="flex justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                    <span className="text-white/80">
                      USDT: ${totalPrizeUSDT.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-white/80">
                      USDC: ${totalPrizeUSDC.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 카운트다운 타이머 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-xl font-bold text-white">
                    추첨까지 남은 시간
                  </h2>
                </div>
                <div className="text-white/60 text-sm">
                  회차 #{activeRound.id.toString()}
                </div>
              </div>

              <div className="text-center">
                <div
                  className={`text-4xl sm:text-5xl font-bold mb-2 ${
                    timeRemaining <= 3600
                      ? "text-red-400"
                      : timeRemaining <= 86400
                      ? "text-yellow-400"
                      : "text-emerald-400"
                  }`}
                >
                  {countdown}
                </div>
                {timeRemaining <= 3600 && timeRemaining > 0 && (
                  <div className="text-red-400 text-sm animate-pulse">
                    ⚠️ 마감 임박!
                  </div>
                )}
              </div>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* USDT 풀 */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">USDT 풀</div>
                    <div className="text-white text-2xl font-bold">
                      ${totalPrizeUSDT.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Users className="w-4 h-4" />
                  <span>
                    {activeRound.ticketCount.toString()}명 참가
                  </span>
                </div>
              </div>

              {/* USDC 풀 */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">USDC 풀</div>
                    <div className="text-white text-2xl font-bold">
                      ${totalPrizeUSDC.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Users className="w-4 h-4" />
                  <span>
                    {activeRound.ticketCount.toString()}명 참가
                  </span>
                </div>
              </div>
            </div>

            {/* 상금 분배 안내 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                상금 분배 구조
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <span className="text-white">1등 (6개 일치)</span>
                  </div>
                  <span className="text-emerald-400 font-bold">70%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <span className="text-white">
                      2등 (5개 + 행운번호)
                    </span>
                  </div>
                  <span className="text-blue-400 font-bold">10%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <span className="text-white">3등 (5개 일치)</span>
                  </div>
                  <span className="text-orange-400 font-bold">20%</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20 text-white/60 text-sm">
                * 상금 풀의 85%가 당첨자에게 분배됩니다
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav isAdmin={false} />
    </div>
  );
}
