// frontend/app/api/uploadMetadata/route.js (최종 버전)

import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const apiKey = process.env.PINATA_API_KEY;
        const secretApiKey = process.env.PINATA_API_SECRET;
        if (!apiKey || !secretApiKey) throw new Error("Pinata API keys are not set");

        const body = await request.json();
        const { numbers, drawNumber, ticketId } = body;

        const metadata = {
        name: `Kiwoom Lottery Ticket #${ticketId}`,
        description: `This is a lottery ticket for draw #${drawNumber}.`,
        image: "ipfs://bafybeifx7yeb55armcsxwwitkymga5xf53dxiary537nmcoo452pthbiye",
        // 이제 API는 화면 표시용 데이터에만 집중합니다.
        attributes: [
            { "trait_type": "Draw Number", "value": drawNumber.toString() },
            ...numbers.map((num, index) => ({
            "trait_type": `Number ${index + 1}`,
            "value": num.toString()
            }))
        ]
        };

        const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': apiKey,
            'pinata_secret_api_key': secretApiKey
        },
        body: JSON.stringify({
            pinataMetadata: { name: `ticket-${ticketId}.json` },
            pinataContent: metadata
        })
        });

        if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Pinata API Error: ${response.status} - ${errorData}`);
        }

        const result = await response.json();
        return NextResponse.json({ ipfsUri: `ipfs://${result.IpfsHash}` }, { status: 200 });

    } catch (error) {
        console.error("!!! METADATA UPLOAD FAILED !!!:", error);
        return NextResponse.json({ error: "Metadata upload failed", details: error.message }, { status: 500 });
    }
}