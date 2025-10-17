import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-20">
        <h1 className="text-4xl font-semibold">Lucky Chain operations</h1>
        <p className="text-lg text-slate-300">
          Welcome to the Lucky Chain tooling workspace. Connect your wallet on the admin console to configure draws, update the
          active round, and trigger randomness once ticket sales close.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >
            Open draw console
          </Link>
        <a
          href="https://kairos.kaiascan.io"
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
        >
          Kairos block explorer
        </a>
      </div>
        <section className="mt-8 space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold">Available actions</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Schedule or edit draw metadata (timestamp, ticket sale status).</li>
            <li>Switch the active draw for ticket sales.</li>
            <li>Request VRF winning numbers for completed draws.</li>
            <li>Review transaction receipts and errors for operator visibility.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}


import { FormEvent, useEffect, useMemo, useState } from 'react';
import { formatEther, Interface, ZeroAddress } from 'ethers';

import lottoAbi from '../../lib/abi.json';
import { useLottoContractContext } from '@/hooks/useLottoContract';

type SubmissionStatus = 'idle' | 'uploading' | 'minting' | 'success' | 'error';

const NUMBER_OF_PICKS = 6;
const MIN_NUMBER = 1;
const MAX_NUMBER = 45;

export default function Home() {
  const {
    address,
    chainId,
    expectedChainId,
    isWalletAvailable,
    isConnecting,
    isWrongNetwork,
    pendingTransaction,
    connectWallet,
    switchToExpectedNetwork,
    getTicketPrice,
    buyTicket,
  } = useLottoContractContext();

  const [numbers, setNumbers] = useState<string[]>(() =>
    Array.from({ length: NUMBER_OF_PICKS }, () => ''),
  );
  const [drawNumber, setDrawNumber] = useState<string>('');
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successTokenId, setSuccessTokenId] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [ticketPrice, setTicketPrice] = useState<string | null>(null);

  const lottoInterface = useMemo(() => new Interface(lottoAbi), []);

  useEffect(() => {
    let isMounted = true;

    const loadPrice = async () => {
      try {
        const value = await getTicketPrice();
        if (!isMounted) return;
        if (value === null) {
          setTicketPrice(null);
          return;
        }
        setTicketPrice(formatEther(value));
      } catch (error) {
        console.error('Failed to load ticket price', error);
        if (isMounted) {
          setTicketPrice(null);
        }
      }
    };

    if (!isWrongNetwork) {
      void loadPrice();
    }

    return () => {
      isMounted = false;
    };
  }, [getTicketPrice, isWrongNetwork]);

  const handleNumberChange = (index: number, value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    setNumbers((previous) => {
      const next = [...previous];
      next[index] = sanitizedValue;
      return next;
    });
  };

  const resetForm = () => {
    setNumbers(Array.from({ length: NUMBER_OF_PICKS }, () => ''));
    setDrawNumber('');
  };

  const extractMintedTokenId = (receipt: Awaited<ReturnType<typeof buyTicket>>) => {
    if (!receipt) return null;

    for (const log of receipt.logs ?? []) {
      try {
        const parsed = lottoInterface.parseLog({ data: log.data, topics: Array.from(log.topics) });
        if (parsed?.name === 'TicketPurchased') {
          const tokenId = parsed.args?.tokenId ?? parsed.args?.[1];
          if (tokenId) {
            return tokenId.toString();
          }
        }
        if (parsed?.name === 'Transfer') {
          const from = (parsed.args?.from ?? parsed.args?.[0]) as string | undefined;
          const tokenId = parsed.args?.tokenId ?? parsed.args?.id ?? parsed.args?.value ?? parsed.args?.[2];
          if (typeof from === 'string' && from.toLowerCase() === ZeroAddress.toLowerCase() && tokenId) {
            return tokenId.toString();
          }
        }
      } catch {
        // Ignore logs that do not match the ABI
      }
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('idle');
    setErrorMessage(null);
    setSuccessTokenId(null);
    setTransactionHash(null);

    const numericNumbers = numbers.map((value) => Number.parseInt(value, 10));
    if (numericNumbers.some((value) => Number.isNaN(value))) {
      setStatus('error');
      setErrorMessage('Please provide all six numbers.');
      return;
    }

    if (numericNumbers.some((value) => value < MIN_NUMBER || value > MAX_NUMBER)) {
      setStatus('error');
      setErrorMessage(`Numbers must be between ${MIN_NUMBER} and ${MAX_NUMBER}.`);
      return;
    }

    const uniqueNumbers = new Set(numericNumbers);
    if (uniqueNumbers.size !== NUMBER_OF_PICKS) {
      setStatus('error');
      setErrorMessage('Numbers must be unique.');
      return;
    }

    if (!drawNumber) {
      setStatus('error');
      setErrorMessage('Please choose a draw number.');
      return;
    }

    const drawValue = Number.parseInt(drawNumber, 10);
    if (Number.isNaN(drawValue) || drawValue <= 0) {
      setStatus('error');
      setErrorMessage('Provide a valid draw number.');
      return;
    }

    try {
      setStatus('uploading');
      const metadataResponse = await fetch('/api/uploadMetadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numbers: numericNumbers,
          drawNumber: drawValue,
          ticketId: Date.now().toString(),
        }),
      });

      if (!metadataResponse.ok) {
        const errorPayload = await metadataResponse.json().catch(() => null);
        throw new Error(errorPayload?.details ?? 'Failed to upload metadata.');
      }

      const { ipfsUri } = (await metadataResponse.json()) as { ipfsUri: string };

      setStatus('minting');
      const receipt = await buyTicket(numericNumbers, ipfsUri);
      if (!receipt) {
        throw new Error('The transaction did not return a receipt.');
      }

      const receiptHash = (receipt as { hash?: string; transactionHash?: string }).hash ??
        (receipt as { hash?: string; transactionHash?: string }).transactionHash ??
        null;
      setTransactionHash(receiptHash);
      const mintedId = extractMintedTokenId(receipt);
      setSuccessTokenId(mintedId);
      setStatus('success');
      resetForm();
    } catch (error) {
      console.error('Ticket purchase failed', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unable to buy ticket.');
    }
  };

  const isFormLocked =
    status === 'uploading' || status === 'minting' || pendingTransaction !== null;

  const isSubmitDisabled = !address || isWrongNetwork || isFormLocked;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Kiwoom Lottery</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Purchase an on-chain lottery ticket by choosing six unique numbers and selecting the draw you want to
          participate in.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
          <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700">
            Ticket price: {ticketPrice ? `${ticketPrice} KAIA` : '—'}
          </span>
          {address ? (
            <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700">
              Connected wallet: {address}
            </span>
          ) : (
            <span className="rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-amber-900 dark:border-amber-500 dark:bg-amber-500/20 dark:text-amber-200">
              Connect your wallet to continue
            </span>
          )}
          {chainId && chainId !== expectedChainId && (
            <span className="rounded-full border border-red-200 bg-red-100 px-3 py-1 text-red-800 dark:border-red-500 dark:bg-red-500/20 dark:text-red-200">
              Connected to chain {chainId} — expected {expectedChainId}
            </span>
          )}
        </div>
        {!isWalletAvailable && (
          <p className="text-sm text-red-600 dark:text-red-400">
            No compatible wallet detected. Install Kaia-compatible wallet such as Kaia or MetaMask to continue.
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-3">
          {!address && (
            <button
              type="button"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-400"
              onClick={() => {
                setErrorMessage(null);
                setStatus('idle');
                void connectWallet();
              }}
              disabled={isConnecting || !isWalletAvailable}
            >
              {isConnecting ? 'Connecting…' : 'Connect wallet'}
            </button>
          )}
          {isWrongNetwork && (
            <button
              type="button"
              className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-purple-500 disabled:cursor-not-allowed disabled:bg-purple-400"
              onClick={() => {
                setErrorMessage(null);
                setStatus('idle');
                void switchToExpectedNetwork();
              }}
              disabled={!address}
            >
              Switch to Kaia Kairos network
            </button>
          )}
        </div>
        {isWrongNetwork && (
          <p className="text-sm text-red-600 dark:text-red-400">
            You are connected to the wrong network. Switch to the Kaia Kairos Testnet before minting a ticket.
          </p>
        )}
        {pendingTransaction && (
          <p className="text-sm text-blue-600 dark:text-blue-300">
            Pending transaction: {pendingTransaction}
          </p>
        )}
      </header>

      <main className="flex-1">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-lg border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60"
        >
          <fieldset className="flex flex-col gap-4" disabled={isFormLocked}>
            <legend className="text-lg font-semibold text-slate-900 dark:text-slate-100">Select your numbers</legend>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {numbers.map((value, index) => (
                <label key={index} className="flex flex-col text-sm font-medium text-slate-700 dark:text-slate-300">
                  Number {index + 1}
                  <input
                    type="number"
                    min={MIN_NUMBER}
                    max={MAX_NUMBER}
                    required
                    value={value}
                    onChange={(event) => handleNumberChange(index, event.target.value)}
                    className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            Draw number
            <input
              type="number"
              min={1}
              required
              value={drawNumber}
              onChange={(event) => setDrawNumber(event.target.value)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  )
}