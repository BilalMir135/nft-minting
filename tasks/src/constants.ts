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
    contractHash: 'hash-d1d6a69d87676a8f125f9e3c2cd3e2328940e38f6a2a94af2436c3527e9d014c',
    packageHash: 'hash-a1a1d41ac0ea24aa19c50ef0a312b3c446185caf0d3a2581b199ff68012c190a',
  },
  [Network.TEST]: { contractHash: '', packageHash: '' },
  [Network.MAIN]: { contractHash: '', packageHash: '' },
};

const MinterContract = {
  [Network.LOCAL]: {
    contractHash: 'hash-eb2d8b9cbad200e27703a804394532792eb4aac610d95d226b8ad0c0e771a2d6',
    packageHash: 'hash-8deaa98cfa314d72e5bf3c11475739ad7f9cfdcc800e5c5a5dcf31ccbf4b13ff',
  },
  [Network.TEST]: { contractHash: '', packageHash: '' },
  [Network.MAIN]: { contractHash: '', packageHash: '' },
};

export const NETWORK = process.env.NETWORK as Network;

export const NODE_ADDRESS = NodeAddress[NETWORK];
export const CEP78_CONTRACT = CEP78Contract[NETWORK];
export const MINTER_CONTRACT = MinterContract[NETWORK];
