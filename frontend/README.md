# Lucky Chain frontend

This Next.js app provides the Lucky Chain lottery experience. Players can connect a wallet, choose six numbers plus a lucky bonus number, upload metadata to Pinata, and mint an ERC-721 lottery ticket that corresponds to the on-chain round. Administrators can close rounds, start the next weekly epoch, request Chainlink VRF randomness, and finalize prize payouts.

## Getting started

```bash
npm install
npm run dev
```

By default the app connects to the Kaia Kairos testnet. Configure the following environment variables in `.env.local`:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_LOTTO_ADDRESS` | Deployed `Lotto` contract address |
| `NEXT_PUBLIC_LOTTO_CHAIN_ID` | Chain ID for the target network (e.g. `1001` for Kairos) |
| `NEXT_PUBLIC_LOTTO_RPC_URL` | RPC endpoint used by the browser and Node scripts |
| `PINATA_JWT` *or* (`PINATA_API_KEY`, `PINATA_API_SECRET`) | Credentials used by `/api/uploadMetadata` when pinning ticket metadata |
| `NEXT_PUBLIC_LOTTO_OWNER` / `NEXT_PUBLIC_LOTTO_ADMINS` | Optional comma-separated list of admin wallet addresses |

> **Note:** The app instantiates a read-only RPC provider using `NEXT_PUBLIC_LOTTO_RPC_URL` so the home and admin pages can load
> round data even when no wallet is connected. Make sure this endpoint is reachable from the browser environment, otherwise read
> helpers such as `getTicketPrice` and `getActiveRound` will fail before a wallet is connected.

Example `.env.local` snippet:

```
NEXT_PUBLIC_LOTTO_ADDRESS=0xYourContract
NEXT_PUBLIC_LOTTO_CHAIN_ID=1001
NEXT_PUBLIC_LOTTO_RPC_URL=https://public-en-kairos.node.kaia.io
PINATA_JWT=eyJhbGciOi...
NEXT_PUBLIC_LOTTO_OWNER=0xAdminWallet
```

Restart the dev server after updating environment variables.

## Features

- **Ticket purchase UI** – enter six manual numbers and a lucky number or generate an automatic ticket. Metadata is uploaded to Pinata before calling `buyTicket(numbers, luckyNumber, isAutoPick, tokenURI)`.
- **Live round status** – the home page displays the active round ID, current phase, ticket price, and the most recently minted ticket.
- **Admin console** – `/admin` exposes controls for closing sales, starting the next 1-week epoch, requesting VRF winning numbers, and finalizing payouts according to the new tiered distribution rules.

## Utility scripts

The `frontend` directory includes Node scripts that mirror the browser flow:
- `manualMint.mjs` – prompts for wallet credentials and ticket numbers, uploads metadata, and executes `buyTicket`.
- `getStats.mjs` – prints aggregate contract data (next ticket ID, current round status).
- `readTokenData.mjs` – inspects stored ticket numbers, lucky numbers, and prize tiers for arbitrary token IDs.

All scripts rely on the same environment variables used by the Next.js app.
