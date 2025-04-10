export interface IPrizePool {
  owner: string;
  vault: string;
  feeRecipient: string;
  treasury: string;
  bonusConfig: {
    bonusPerEpoch: bigint;
    maxBonus: bigint;
    decayPerEpoch: bigint;
  };
  epochConfig: {
    epochDuration: bigint;
    entryDeadline: bigint;
    maxParticipants: bigint;
  };
  participationRules: {
    minDepositAmount: bigint;
    maxWithdrawFee: bigint;
  };
}
