import type { ReactNode } from "react";
import { formatUnits } from "ethers";

import type { RoundInfo } from "@/hooks/useLottoV2Contract";

type RoundStatsGridProps = {
    round?: RoundInfo | null;
    className?: string;
    footer?: ReactNode;
};

const formatUSD = (value: bigint | null | undefined): string => {
    if (value == null) {
        return "—";
    }

    try {
        return `$${Number(formatUnits(value, 6)).toFixed(2)}`;
    } catch (error) {
        console.error("Failed to format USD amount", error);
        return value.toString();
    }
};

export function RoundStatsGrid({ round, className, footer }: RoundStatsGridProps) {
    const jackpotPoolUSDT = round ? round.grossUSDT + round.carryInUSDT : null;
    const jackpotPoolUSDC = round ? round.grossUSDC + round.carryInUSDC : null;
    const ticketsSold = round ? round.ticketCount.toString() : "—";

    const stats = [
        {
            label: "Tickets this round",
            value: ticketsSold,
            hint: round ? "Total NFTs minted for the active round." : undefined,
        },
        {
            label: "Total spent (USDT)",
            value: formatUSD(round?.grossUSDT),
            hint: "Aggregate ticket sales paid in USDT.",
        },
        {
            label: "Total spent (USDC)",
            value: formatUSD(round?.grossUSDC),
            hint: "Aggregate ticket sales paid in USDC.",
        },
        {
            label: "Jackpot size (USDT)",
            value: formatUSD(jackpotPoolUSDT),
            hint: "Carry-in plus current round USDT sales.",
        },
        {
            label: "Jackpot size (USDC)",
            value: formatUSD(jackpotPoolUSDC),
            hint: "Carry-in plus current round USDC sales.",
        },
    ];

    const containerClass = ["grid gap-3 sm:grid-cols-3", className].filter(Boolean).join(" ");

    return (
        <div className={containerClass}>
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-950/40 p-4"
                >
                    <span className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</span>
                    <span className="text-lg font-semibold text-slate-100">{stat.value}</span>
                    {stat.hint && <span className="text-xs text-slate-500">{stat.hint}</span>}
                </div>
            ))}
            {footer && <div className="sm:col-span-3">{footer}</div>}
        </div>
    );
}

export default RoundStatsGrid;
