import type { ReactNode } from "react";
import { formatEther } from "ethers";

import type { RoundInfo } from "@/hooks/useLottoContract";

type RoundStatsGridProps = {
    round?: RoundInfo | null;
    className?: string;
    footer?: ReactNode;
};

const formatKaia = (value: bigint | null | undefined): string => {
    if (value == null) {
        return "—";
    }

    try {
        return `${formatEther(value)} KAIA`;
    } catch (error) {
        console.error("Failed to format KAIA amount", error);
        return value.toString();
    }
};

export function RoundStatsGrid({ round, className, footer }: RoundStatsGridProps) {
    const jackpotPool = round ? round.gross + round.carryIn : null;
    const ticketsSold = round ? round.ticketCount.toString() : "—";

    const stats = [
        {
            label: "Tickets this round",
            value: ticketsSold,
            hint: round ? "Total NFTs minted for the active round." : undefined,
        },
        {
            label: "Total spent",
            value: formatKaia(round?.gross),
            hint: "Aggregate ticket sales paid so far.",
        },
        {
            label: "Jackpot size",
            value: formatKaia(jackpotPool),
            hint: "Carry-in plus current round sales.",
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