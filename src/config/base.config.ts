import 'dotenv/config';

export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  ethereum: {
    rpcUrl: process.env.RPC_URL,
    contracts: {},
  },
  wallet: {
    accountAddress: process.env.ACCOUNT_ADDRESS,
    privateKey: process.env.PRIVATE_KEY,
  },
});
