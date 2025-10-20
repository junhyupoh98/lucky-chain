import contractConfigRuntime from './contractConfig.mjs';

export type ContractConfig = {
    address?: `0x${string}` | string;
    chainId?: number;
    rpcUrl?: string;
};

export const contractConfig: ContractConfig = contractConfigRuntime;
export const { address, chainId, rpcUrl } = contractConfig;

export default contractConfig;