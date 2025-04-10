import { Contract, FeeData, JsonRpcProvider, TransactionReceipt } from 'ethers';

interface SafeTxOptions {
  gasBuffer?: number;
  logPrefix?: string;
  args?: any[];
}

async function getGasPrice(provider: JsonRpcProvider): Promise<FeeData> {
  const feeData = await provider.getFeeData();
  if (!feeData) {
    throw new Error('Failed to fetch fee data from provider.');
  }
  return feeData.toJSON();
}

export async function safeTx({
  contract,
  functionName,
  provider,
  options = {},
}: {
  contract: Contract;
  functionName: string;
  provider: JsonRpcProvider;
  options?: SafeTxOptions;
}): Promise<TransactionReceipt | null> {
  const { gasBuffer = 1.2, logPrefix = functionName, args = [] } = options;

  try {
    console.log(`[${logPrefix}] Estimating gas for ${functionName} with args:`, args);
    const gasEstimate = await contract[functionName].estimateGas(...args);
    console.log(`[${logPrefix}] Raw gas estimate: ${gasEstimate.toString()}`);

    const gasLimit = BigInt(Math.ceil(Number(gasEstimate) * gasBuffer));
    console.log(`[${logPrefix}] Gas limit with buffer (${gasBuffer}x): ${gasLimit.toString()}`);

    const feeData = await getGasPrice(provider);
    console.log(`[${logPrefix}] Fee data fetched:`);
    console.log(`  - maxFeePerGas: ${feeData.maxFeePerGas?.toString()}`);
    console.log(`  - maxPriorityFeePerGas: ${feeData.maxPriorityFeePerGas?.toString()}`);

    const tx = await contract[functionName](...args, {
      gasLimit,
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    });

    console.log(`[${logPrefix}][🟠] Transaction sent: ${tx.hash}`);
    const receipt = await tx.wait();
    if (receipt?.status === 1) {
      console.log(`[${logPrefix}][🟢] Transaction confirmed in block ${receipt.blockNumber}`);
      return receipt;
    }
    console.error(`[${logPrefix}][🔴] Transaction failed in block ${receipt.blockNumber}`);
    return null;
  } catch (err: any) {
    console.error(`[${logPrefix}][🔴] ${err.message || err}`);
    return null;
  }
}
