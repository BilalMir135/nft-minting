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
    contractHash: 'hash-0e3d7dd958cbfa156cc28224c1032a53af5b688c6b2d38bd58322ea8f743f2fe',
    packageHash: 'hash-3af1f8b7b151628bd3f39980dad3213ed0d41d84ec38d02ea5a8695d66e21db3',
  },
  [Network.TEST]: { contractHash: '', packageHash: '' },
  [Network.MAIN]: { contractHash: '', packageHash: '' },
};

const MinterContract = {
  [Network.LOCAL]: {
    contractHash: 'hash-24876cbac3ddc26a7c33fc025b419f096bf15ab9d97a696a35e17692a9c5d6b6',
    packageHash: 'hash-86d8f3c9a85c1c570a0114759318ee0b90a44a52c290734a9c8274860e87222c',
  },
  [Network.TEST]: { contractHash: '', packageHash: '' },
  [Network.MAIN]: { contractHash: '', packageHash: '' },
};

export const NETWORK = process.env.NETWORK as Network;

export const NODE_ADDRESS = NodeAddress[NETWORK];
export const CEP78_CONTRACT = CEP78Contract[NETWORK];
export const MINTER_CONTRACT = MinterContract[NETWORK];
