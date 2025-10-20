import 'server-only';

const PINATA_ENDPOINT = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

export interface TicketPayload {
    drawId: string;
    numbers: number[];
    luckyNumber: number;
    isAutoPick: boolean;
    owner: `0x${string}`;
    timestamp: string;
}

function createAuthHeaders(): Record<string, string> {
    const { PINATA_JWT, PINATA_API_KEY, PINATA_API_SECRET } = process.env;
    if (PINATA_JWT) {
        return {
            Authorization: `Bearer ${PINATA_JWT}`,
        };
    }

    if (PINATA_API_KEY && PINATA_API_SECRET) {
        return {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_API_SECRET,
        };
    }

    throw new Error(
        'Pinata credentials are not configured. Set PINATA_JWT or the PINATA_API_KEY and PINATA_API_SECRET pair.',
    );
}

export async function uploadTicketMetadata(ticket: TicketPayload): Promise<string> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...createAuthHeaders(),
    };

    const sanitizedTimestamp = new Date(ticket.timestamp).toISOString();
    const pinataMetadataName = `lottery-ticket-${ticket.drawId}-${ticket.owner.toLowerCase()}-${sanitizedTimestamp}`;

    const response = await fetch(PINATA_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            pinataContent: {
                drawId: ticket.drawId,
                numbers: ticket.numbers,
                luckyNumber: ticket.luckyNumber,
                isAutoPick: ticket.isAutoPick,
                owner: ticket.owner,
                timestamp: sanitizedTimestamp,
            },
            pinataMetadata: {
                name: pinataMetadataName,
            },
        }),
    });

    if (!response.ok) {
        let errorMessage = `Pinata upload failed with status ${response.status}`;
        const rawBody = await response.text();
        if (rawBody) {
            try {
                const errorBody = JSON.parse(rawBody) as { error?: string };
                if (errorBody.error) {
                    errorMessage = `${errorMessage}: ${errorBody.error}`;
                } else {
                errorMessage = `${errorMessage}: ${rawBody}`;
                }
            } catch (error) {
                errorMessage = `${errorMessage}: ${rawBody}`;
            }
        }
        throw new Error(errorMessage);
    }

    const payload = (await response.json()) as { IpfsHash?: string };
    if (!payload.IpfsHash) {
        throw new Error('Pinata response did not include a CID (IpfsHash).');
    }

    return payload.IpfsHash;
}

export async function uploadTicketsMetadata(tickets: TicketPayload[]): Promise<string[]> {
    if (tickets.length === 0) {
        return [];
    }

    const uploads = tickets.map((ticket) => uploadTicketMetadata(ticket));
    return Promise.all(uploads);
}
