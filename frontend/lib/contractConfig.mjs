const address =
    process.env.NEXT_PUBLIC_LOTTO_ADDRESS ??
    process.env.LOTTO_CONTRACT_ADDRESS ??
    process.env.CONTRACT_ADDRESS ??
    undefined;

const rpcUrl =
    process.env.NEXT_PUBLIC_LOTTO_RPC_URL ??
    process.env.LOTTO_RPC_URL ??
    process.env.RPC_URL ??
    process.env.KAIA_TESTNET_RPC_URL ??
    undefined;

const rawChainId =
    process.env.NEXT_PUBLIC_LOTTO_CHAIN_ID ??
    process.env.LOTTO_CHAIN_ID ??
    process.env.CHAIN_ID ??
    undefined;

const chainId =
    typeof rawChainId === 'string' && rawChainId.length > 0
        ? Number(rawChainId)
        : undefined;

if (chainId !== undefined && Number.isNaN(chainId)) {
    throw new Error(
        'Invalid chain id provided. Ensure NEXT_PUBLIC_LOTTO_CHAIN_ID or LOTTO_CHAIN_ID is a number.',
    );
}

/**
 * @typedef {Object} ContractConfig
 * @property {string | undefined} address
 * @property {number | undefined} chainId
 * @property {string | undefined} rpcUrl
 */

/** @type {ContractConfig} */
const contractConfig = Object.freeze({
    address,
    chainId,
    rpcUrl,
});

export { contractConfig };
export const { address: contractAddress, chainId: contractChainId, rpcUrl: contractRpcUrl } = contractConfig;
export default contractConfig;