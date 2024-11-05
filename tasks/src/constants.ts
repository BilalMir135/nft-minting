export enum Network {
  LOCAL = 'casper-net-1',
  TEST = 'testnet',
  MAIN = 'casper',
}

const NodeAddress: Record<Network, string> = {
  [Network.LOCAL]: 'http://localhost:11101',
  [Network.TEST]: `https://testnet.casper.validationcloud.io/v1/${process.env.VALIDATION_CLOUD_KEY}`,
  [Network.MAIN]: ``,
};

const CEP78Contract = {
  [Network.LOCAL]: {
    contractHash: 'hash-7320ca18d02e935a312106d1f4e75a7070d18f5a02600839700b4a0dfbe5383c',
    packageHash: 'hash-dd4936cb4aaaddc17c234d2bf006a4e97c6d128e5300724ba7186506a79b0f5f',
  },
  [Network.TEST]: { contractHash: '', packageHash: '' },
  [Network.MAIN]: { contractHash: '', packageHash: '' },
};

const MinterContract = {
  [Network.LOCAL]: {
    contractHash: 'hash-5edeb565b3659d33eac83d7b1ee7f86cd56b84a568cdeb94cb5ea1287c81f35d',
    packageHash: 'hash-6432948fdfad6cbba5752f2c8e00f0c922119ed15c62f7336fdb1404633af0c5',
  },
  [Network.TEST]: { contractHash: '', packageHash: '' },
  [Network.MAIN]: { contractHash: '', packageHash: '' },
};

export const NETWORK = process.env.NETWORK as Network;

export const NODE_ADDRESS = NodeAddress[NETWORK];
export const CEP78_CONTRACT = CEP78Contract[NETWORK];
export const MINTER_CONTRACT = MinterContract[NETWORK];
