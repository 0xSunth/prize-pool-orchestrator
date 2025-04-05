import 'dotenv/config';

export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  ethereum: {
    sepolia: {
      rpcUrl: process.env.RPC_URL,
      contracts: {
        prizePoolFactory: process.env.PRIZE_POOL_FACTORY,
      },
    },
  },
  wallet: {
    accountAddress: process.env.ACCOUNT_ADDRESS,
    privateKey: process.env.PRIVATE_KEY,
  },
});
