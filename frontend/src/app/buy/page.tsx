"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLottoV2ContractContext } from "@/hooks/useLottoV2Contract";
import type { RoundInfo } from "@/hooks/useLottoV2Contract";
import { parseUnits, formatUnits } from "ethers";
import BottomNav from "@/components/BottomNav";
import { Shuffle, Hand } from "lucide-react";

export default function BuyPage() {
  const router = useRouter();
  const {
    address,
    isWrongNetwork,
    connectWallet,
    switchToExpectedNetwork,
    getActiveRound,
    buyTicket,
    buyTickets,
    approveToken,
    getTokenAllowance,
    getTokenBalance,
    ticketPriceUSD,
    pendingTransaction,
    isWalletAvailable,
  } = useLottoV2ContractContext();

  const [activeRound, setActiveRound] = useState<RoundInfo | null>(null);
  const [useUSDT, setUseUSDT] = useState(true);
  const [ticketCount, setTicketCount] = useState(1);
  const [selectionMode, setSelectionMode] = useState<"auto" | "manual">("auto");
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [tokenAllowance, setTokenAllowance] = useState<bigint>(0n);

  useEffect(() => {
    const load = async () => {
      const round = await getActiveRound();
      setActiveRound(round);
    };
    load();
  }, [getActiveRound]);

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

  const handleNumberClick = (num: number) => {
    if (selectionMode !== "manual") return;

    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else if (selectedNumbers.length < 6) {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      const amount = parseUnits(
        (parseFloat(ticketPriceUSD) * ticketCount).toString(),
        6
      );
      await approveToken(useUSDT, amount);
      showMessage("승인 완료!");

      const allowance = await getTokenAllowance(useUSDT);
      setTokenAllowance(allowance);
    } catch (error: any) {
      showMessage(error.message || "승인 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyTickets = async () => {
    setLoading(true);
    try {
      const uris = Array(ticketCount).fill("ipfs://placeholder");

      if (ticketCount === 1) {
        await buyTicket(useUSDT, uris[0]);
      } else {
        await buyTickets(useUSDT, ticketCount, uris);
      }

      router.push(
        `/fortune?count=${ticketCount}&mode=${selectionMode}&numbers=${selectedNumbers.join(",")}`
      );
    } catch (error: any) {
      showMessage(error.message || "구매 실패");
      setLoading(false);
    }
  };

  const needsApproval =
    tokenAllowance <
    parseUnits((parseFloat(ticketPriceUSD) * ticketCount).toString(), 6);

  const canPurchase =
    selectionMode === "auto" || selectedNumbers.length === 6;

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
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-white">🎫 티켓 구매</h1>
        </header>

        {message && (
          <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-white text-center">
            {message}
          </div>
        )}

        {!address ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
            <p className="text-white/80 mb-4">
              티켓을 구매하려면 지갑을 연결해주세요
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
        ) : activeRound?.phase !== "sales" ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
            <p className="text-white/80">현재 티켓 판매가 종료되었습니다</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 선택 모드 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                번호 선택 방식
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setSelectionMode("auto");
                    setSelectedNumbers([]);
                    setTicketCount(1);
                  }}
                  className={`p-6 rounded-xl border-2 transition ${
                    selectionMode === "auto"
                      ? "border-emerald-500 bg-emerald-500/20"
                      : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <Shuffle
                    className={`w-8 h-8 mx-auto mb-2 ${
                      selectionMode === "auto"
                        ? "text-emerald-400"
                        : "text-white/60"
                    }`}
                  />
                  <div
                    className={`font-bold mb-1 ${
                      selectionMode === "auto" ? "text-white" : "text-white/60"
                    }`}
                  >
                    자동 선택
                  </div>
                  <div className="text-white/60 text-sm">
                    번호가 자동으로 생성됩니다
                  </div>
                </button>

                <button
                  onClick={() => {
                    setSelectionMode("manual");
                    setSelectedNumbers([]);
                    setTicketCount(1);
                  }}
                  className={`p-6 rounded-xl border-2 transition ${
                    selectionMode === "manual"
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <Hand
                    className={`w-8 h-8 mx-auto mb-2 ${
                      selectionMode === "manual"
                        ? "text-blue-400"
                        : "text-white/60"
                    }`}
                  />
                  <div
                    className={`font-bold mb-1 ${
                      selectionMode === "manual" ? "text-white" : "text-white/60"
                    }`}
                  >
                    수동 선택
                  </div>
                  <div className="text-white/60 text-sm">
                    직접 6개 번호를 선택합니다
                  </div>
                </button>
              </div>
            </div>

            {/* 수동 선택 UI */}
            {selectionMode === "manual" && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">
                    번호 선택 ({selectedNumbers.length}/6)
                  </h2>
                  <button
                    onClick={() => setSelectedNumbers([])}
                    className="text-white/60 hover:text-white text-sm"
                  >
                    초기화
                  </button>
                </div>

                {/* 선택된 번호 표시 */}
                <div className="mb-4 min-h-[60px] flex items-center justify-center gap-2 p-4 bg-white/5 rounded-lg">
                  {selectedNumbers.length === 0 ? (
                    <div className="text-white/40 text-sm">
                      아래에서 6개 번호를 선택하세요
                    </div>
                  ) : (
                    selectedNumbers.map((num) => (
                      <div
                        key={num}
                        className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      >
                        {num}
                      </div>
                    ))
                  )}
                </div>

                {/* 번호 그리드 */}
                <div className="grid grid-cols-9 gap-2">
                  {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => handleNumberClick(num)}
                      disabled={
                        selectedNumbers.length >= 6 &&
                        !selectedNumbers.includes(num)
                      }
                      className={`aspect-square rounded-lg font-bold text-sm transition ${
                        selectedNumbers.includes(num)
                          ? "bg-blue-500 text-white"
                          : "bg-white/10 text-white/80 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <div className="mt-4 text-white/60 text-sm text-center">
                  💡 행운 번호는 자동으로 생성됩니다
                </div>
              </div>
            )}

            {/* 결제 토큰 선택 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">결제 토큰</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => setUseUSDT(true)}
                  className={`py-3 rounded-lg font-semibold transition ${
                    useUSDT
                      ? "bg-emerald-500 text-white"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  USDT
                </button>
                <button
                  onClick={() => setUseUSDT(false)}
                  className={`py-3 rounded-lg font-semibold transition ${
                    !useUSDT
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  USDC
                </button>
              </div>
              <div className="text-white/60 text-sm">
                잔액: ${tokenBalance}
              </div>
            </div>

            {/* 수량 선택 (자동 모드만) */}
            {selectionMode === "auto" && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  티켓 수량
                </h2>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={ticketCount}
                  onChange={(e) =>
                    setTicketCount(
                      Math.max(1, Math.min(50, parseInt(e.target.value) || 1))
                    )
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-lg"
                />
                <div className="text-white/60 text-sm mt-2">
                  최대 50장까지 구매 가능
                </div>
              </div>
            )}

            {/* 결제 정보 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">결제 정보</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-white/80">
                  <span>티켓 가격</span>
                  <span>${ticketPriceUSD}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>수량</span>
                  <span>{ticketCount}장</span>
                </div>
                <div className="border-t border-white/20 pt-2 mt-2">
                  <div className="flex justify-between text-white font-bold text-xl">
                    <span>총 금액</span>
                    <span>
                      ${(parseFloat(ticketPriceUSD) * ticketCount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 구매 버튼 */}
            <div className="space-y-3">
              {needsApproval ? (
                <button
                  onClick={handleApprove}
                  disabled={loading || !!pendingTransaction}
                  className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-white font-bold text-lg rounded-lg transition"
                >
                  {loading || pendingTransaction ? "처리중..." : "토큰 승인"}
                </button>
              ) : (
                <button
                  onClick={handleBuyTickets}
                  disabled={loading || !!pendingTransaction || !canPurchase}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 text-white font-bold text-lg rounded-lg transition"
                >
                  {loading || pendingTransaction
                    ? "처리중..."
                    : !canPurchase
                    ? "6개 번호를 선택하세요"
                    : "구매하기"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <BottomNav isAdmin={false} />
    </div>
  );
}
