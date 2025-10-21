"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const fortuneMessages = [
  "행운이 당신을 따르고 있습니다! 🍀",
  "오늘은 특별한 날이 될 것입니다! ✨",
  "큰 행운이 곧 찾아올 것입니다! 🌟",
  "당신의 꿈이 이루어질 것입니다! 💫",
  "행복한 소식이 기다리고 있습니다! 🎉",
  "긍정적인 에너지가 넘칩니다! ⚡",
  "좋은 일이 연속으로 일어날 것입니다! 🎊",
  "당신은 행운의 주인공입니다! 👑",
  "믿음을 가지세요, 기적이 일어날 것입니다! 🌈",
  "당신의 선택은 옳았습니다! 💎",
];

export default function FortunePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fortune, setFortune] = useState("");
  const [showFortune, setShowFortune] = useState(false);

  const count = searchParams.get("count") || "1";
  const mode = searchParams.get("mode") || "auto";
  const numbers = searchParams.get("numbers") || "";

  useEffect(() => {
    const seed = numbers
      ? numbers.split(",").reduce((acc, n) => acc + parseInt(n), 0)
      : Date.now();
    const fortuneIndex = seed % fortuneMessages.length;
    setFortune(fortuneMessages[fortuneIndex]);

    const timer = setTimeout(() => setShowFortune(true), 1000);
    return () => clearTimeout(timer);
  }, [numbers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block animate-bounce mb-4">
            <Sparkles className="w-16 h-16 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            🥠 포춘 쿠키
          </h1>
          <p className="text-white/80">당신의 행운을 확인하세요!</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-6">
          <div className="text-center mb-6">
            <div className="text-emerald-400 text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              구매 완료!
            </h2>
            <p className="text-white/80">
              {count}장의 티켓을 성공적으로 구매했습니다
            </p>
          </div>

          {mode === "manual" && numbers && (
            <div className="mb-6 p-4 bg-white/5 rounded-xl">
              <div className="text-white/60 text-sm mb-2 text-center">
                선택한 번호
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                {numbers.split(",").map((num, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  >
                    {num}
                  </div>
                ))}
              </div>
              <div className="text-white/60 text-xs mt-2 text-center">
                + 행운 번호 (자동 생성)
              </div>
            </div>
          )}

          <div
            className={`transition-all duration-1000 ${
              showFortune
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-4"
            }`}
          >
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-2xl p-6 mb-6">
              <div className="text-center">
                <div className="text-yellow-400 text-3xl mb-3">🔮</div>
                <p className="text-white text-xl font-bold">{fortune}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/buy"
              className="block w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition text-center"
            >
              더 구매하기
            </Link>
            <Link
              href="/profile"
              className="block w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition text-center"
            >
              구매한 티켓 확인
            </Link>
            <Link
              href="/home"
              className="block w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition text-center"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>

        <div className="text-center text-white/60 text-sm">
          <p>추첨 결과는 라운드 종료 후 확인할 수 있습니다</p>
          <p className="mt-1">행운을 빕니다! 🍀</p>
        </div>
      </div>
    </div>
  );
}
