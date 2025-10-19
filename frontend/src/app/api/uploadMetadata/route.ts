import { NextRequest, NextResponse } from 'next/server';

import { uploadTicketMetadata } from '@/lib/pinata';

type UploadRequestBody = {
    numbers?: number[];
    luckyNumber?: number;
    drawId?: string | number;
    drawNumber?: string | number;
    walletAddress?: string;
    address?: string;
    isAutoPick?: boolean;
    timestamp?: string;
};

const MIN_NUMBER = 1;
const MAX_NUMBER = 45;
const REQUIRED_COUNT = 6;

function parseNumbers(input: unknown): number[] {
    if (!Array.isArray(input)) {
        throw new Error('numbers must be an array of integers.');
    }

    if (input.length !== REQUIRED_COUNT) {
        throw new Error(`numbers must contain exactly ${REQUIRED_COUNT} values.`);
    }

    const parsed = input.map((value) => {
        if (typeof value !== 'number' || !Number.isInteger(value)) {
            throw new Error('numbers must be integers.');
        }
        if (value < MIN_NUMBER || value > MAX_NUMBER) {
            throw new Error(`numbers must be between ${MIN_NUMBER} and ${MAX_NUMBER}.`);
        }
        return value;
    });

    const unique = new Set(parsed);
    if (unique.size !== parsed.length) {
        throw new Error('numbers must be unique.');
    }

    return parsed;
}

function parseLuckyNumber(value: unknown): number {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
        throw new Error('luckyNumber must be an integer.');
    }
    if (value < MIN_NUMBER || value > MAX_NUMBER) {
        throw new Error(`luckyNumber must be between ${MIN_NUMBER} and ${MAX_NUMBER}.`);
    }
    return value;
}

function normalizeDrawId(value: unknown): string {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return Math.trunc(value).toString();
    }
    if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
    }
    throw new Error('drawId is required.');
}

function normalizeWallet(value: unknown): `0x${string}` {
    if (typeof value !== 'string') {
        throw new Error('walletAddress is required.');
    }

    const trimmed = value.trim().toLowerCase();
    if (!/^0x[a-f0-9]{40}$/.test(trimmed)) {
        throw new Error('walletAddress must be a valid EVM address.');
    }

    return trimmed as `0x${string}`;
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as UploadRequestBody;

        const numbers = parseNumbers(body.numbers);
        const luckyNumber = parseLuckyNumber(body.luckyNumber);
        if (numbers.includes(luckyNumber)) {
            throw new Error('luckyNumber must be different from the six main numbers.');
        }
        const drawId = normalizeDrawId(body.drawId ?? body.drawNumber);
        const owner = normalizeWallet(body.walletAddress ?? body.address);
        const isAutoPick = Boolean(body.isAutoPick);
        const timestamp = body.timestamp ?? new Date().toISOString();

        const cid = await uploadTicketMetadata({
            drawId,
            numbers,
            luckyNumber,
            isAutoPick,
            owner,
            timestamp,
        });

        return NextResponse.json({ ipfsUri: `ipfs://${cid}` });
    } catch (error) {
        console.error('Metadata upload failed', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
