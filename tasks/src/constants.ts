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
    contractHash: 'hash-402f7a7bcfa987099ce9370ad5ea89161b8627c4aa8087a03322588800b3ea88',
    packageHash: 'hash-438de486927a8d3e32ef06b33f5c29e6aa7432e10fc9d557ed4675fabd257b1f',
  },
  [Network.TEST]: { contractHash: '', packageHash: '' },
  [Network.MAIN]: { contractHash: '', packageHash: '' },
};

const MinterContract = {
  [Network.LOCAL]: {
    contractHash: 'hash-e7e8e3aa60391a37784cea7843c18c00a8c9c8dd130d892d02b2699638d85071',
    packageHash: 'hash-1a8a62ea3968723e8ee2e6ab6db09e6c23e66184533a1db1a5af130a6a968549',
  },
  [Network.TEST]: { contractHash: '', packageHash: '' },
  [Network.MAIN]: { contractHash: '', packageHash: '' },
};

const WETHContract = {
  [Network.LOCAL]: {
    contractHash: 'hash-80167344b3d4e90259ecd9335cbd229ee4949cc98e46a1ca4b7f4286c0a17704',
    packageHash: 'hash-9e27c61a5f0fe5cbcf4a487610fbc03b3fb8b33c671604d3dbe172a4d500bc26',
  },
  [Network.TEST]: { contractHash: '', packageHash: '' },
  [Network.MAIN]: { contractHash: '', packageHash: '' },
};

export const NETWORK = process.env.NETWORK as Network;

export const NODE_ADDRESS = NodeAddress[NETWORK];
export const CEP78_CONTRACT = CEP78Contract[NETWORK];
export const MINTER_CONTRACT = MinterContract[NETWORK];
export const WETH_CONTRACT = WETHContract[NETWORK];
