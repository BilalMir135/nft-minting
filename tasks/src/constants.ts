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
    contractHash: 'hash-16052a58d541500a1d40454988b404bcb882740e72f20742649b2a9a5410c180',
    packageHash: 'hash-82411f917e594d9f6d19683dfb407f8b6e8c5e7d0d1333e7b608f1eab889626e',
  },
  [Network.TEST]: { contractHash: '', packageHash: '' },
  [Network.MAIN]: { contractHash: '', packageHash: '' },
};

const MinterContract = {
  [Network.LOCAL]: {
    contractHash: 'hash-06a24a637dfcf8893f0957dc8a23c185e52c214658f141a0df62ae5120664f24',
    packageHash: 'hash-2afb16be872c8d7f6d1fd759ea39c5171cfc888d1fd4f1375857c24c98901435',
  },
  [Network.TEST]: { contractHash: '', packageHash: '' },
  [Network.MAIN]: { contractHash: '', packageHash: '' },
};

export const NETWORK = process.env.NETWORK as Network;

export const NODE_ADDRESS = NodeAddress[NETWORK];
export const CEP78_Contract_KEYS = CEP78Contract[NETWORK];
export const MINTER_CONTRACT = MinterContract[NETWORK];
