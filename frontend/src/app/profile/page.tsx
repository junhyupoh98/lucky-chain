"use client";

import { useEffect, useState } from "react";
import { useLottoV2ContractContext } from "@/hooks/useLottoV2Contract";
import type { TicketData } from "@/hooks/useLottoV2Contract";
import { formatUnits } from "ethers";
import BottomNav from "@/components/BottomNav";
import { Ticket, Calendar, Award, CheckCircle } from "lucide-react";

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

export default function ProfilePage() {
  const {
    address,
    isWrongNetwork,
    connectWallet,
    disconnectWallet,
    switchToExpectedNetwork,
    getTicketData,
    claimPrize,
    pendingTransaction,
    isWalletAvailable,
  } = useLottoV2ContractContext();

  const [myTickets, setMyTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "won" | "claimed">(
    "all"
  );

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

  const getStatusText = (ticket: TicketData) => {
    if (ticket.claimed) return "수령완료";
    if (ticket.tier > 0) return "당첨";
    return "진행중";
  };

  const getStatusColor = (ticket: TicketData) => {
    if (ticket.claimed) return "bg-gray-500";
    if (ticket.tier > 0) return "bg-emerald-500";
    return "bg-blue-500";
  };

  const filteredTickets = myTickets.filter((ticket) => {
    switch (filter) {
      case "active":
        return !ticket.claimed && ticket.tier === 0;
      case "won":
        return ticket.tier > 0 && !ticket.claimed;
      case "claimed":
        return ticket.claimed;
      default:
        return true;
    }
  });

  const stats = {
    total: myTickets.length,
    active: myTickets.filter((t) => !t.claimed && t.tier === 0).length,
    won: myTickets.filter((t) => t.tier > 0 && !t.claimed).length,
    claimed: myTickets.filter((t) => t.claimed).length,
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
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Ticket className="w-8 h-8" />내 티켓
            </h1>
            {address && (
              <button
                onClick={disconnectWallet}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition text-sm"
              >
                연결 해제
              </button>
            )}
          </div>
        </header>

        {message && (
          <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-white text-center">
            {message}
          </div>
        )}

        {!address ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
            <p className="text-white/80 mb-4">
              티켓을 확인하려면 지갑을 연결해주세요
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
            {/* 지갑 정보 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-white/60 text-sm mb-1">지갑 주소</div>
                  <div className="text-white font-mono text-lg">
                    {address.slice(0, 10)}...{address.slice(-8)}
                  </div>
                </div>
              </div>

              {/* 통계 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">전체 티켓</div>
                  <div className="text-white text-2xl font-bold">
                    {stats.total}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">진행중</div>
                  <div className="text-blue-400 text-2xl font-bold">
                    {stats.active}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">당첨</div>
                  <div className="text-emerald-400 text-2xl font-bold">
                    {stats.won}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">수령완료</div>
                  <div className="text-gray-400 text-2xl font-bold">
                    {stats.claimed}
                  </div>
                </div>
              </div>
            </div>

            {/* 필터 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4">
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                    filter === "all"
                      ? "bg-white text-purple-900"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  전체 ({stats.total})
                </button>
                <button
                  onClick={() => setFilter("active")}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                    filter === "active"
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  진행중 ({stats.active})
                </button>
                <button
                  onClick={() => setFilter("won")}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                    filter === "won"
                      ? "bg-emerald-500 text-white"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  당첨 ({stats.won})
                </button>
                <button
                  onClick={() => setFilter("claimed")}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                    filter === "claimed"
                      ? "bg-gray-500 text-white"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  수령완료 ({stats.claimed})
                </button>
              </div>
            </div>

            {/* 티켓 목록 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">티켓 목록</h2>

              {filteredTickets.length === 0 ? (
                <div className="text-center py-12">
                  <Ticket className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">
                    {filter === "all"
                      ? "구매한 티켓이 없습니다"
                      : "해당하는 티켓이 없습니다"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition"
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1">
                          {/* 티켓 헤더 */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-white/60 text-sm">
                                티켓 #{ticket.id}
                              </span>
                              <span className="text-white/40 text-sm">
                                회차 #{ticket.roundId.toString()}
                              </span>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-full text-white font-bold text-xs ${getStatusColor(
                                ticket
                              )}`}
                            >
                              {getStatusText(ticket)}
                            </div>
                          </div>

                          {/* 번호 */}
                          <div className="flex gap-2 flex-wrap mb-3">
                            {ticket.numbers.map((num, i) => (
                              <div
                                key={i}
                                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold"
                              >
                                {num}
                              </div>
                            ))}
                            <div className="w-10 h-10 bg-yellow-400/50 rounded-full flex items-center justify-center text-white font-semibold">
                              {ticket.luckyNumber}
                            </div>
                          </div>

                          {/* 정보 */}
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1 text-white/60">
                              <Calendar className="w-4 h-4" />
                              <span>{formatTime(ticket.purchasedAt)}</span>
                            </div>
                            {ticket.tier > 0 && (
                              <div className="flex items-center gap-1">
                                <Award className="w-4 h-4 text-yellow-400" />
                                <span
                                  className={`font-bold ${
                                    ticket.tier === 1
                                      ? "text-yellow-400"
                                      : ticket.tier === 2
                                      ? "text-gray-400"
                                      : "text-orange-400"
                                  }`}
                                >
                                  {getTierText(ticket.tier)}
                                </span>
                              </div>
                            )}
                            {ticket.claimed && (
                              <div className="flex items-center gap-1 text-gray-400">
                                <CheckCircle className="w-4 h-4" />
                                <span>수령완료</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 액션 버튼 */}
                        {ticket.tier > 0 && !ticket.claimed && (
                          <div className="flex items-center">
                            <button
                              onClick={() => handleClaim(BigInt(ticket.id))}
                              disabled={loading || !!pendingTransaction}
                              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 text-white font-semibold rounded-lg transition whitespace-nowrap"
                            >
                              {loading || pendingTransaction
                                ? "처리중..."
                                : "당첨금 수령"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <BottomNav isAdmin={false} />
    </div>
  );
}
