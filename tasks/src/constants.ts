export enum Network {
  LOCAL = 'casper-net-1',
  TEST = 'casper-test',
  MAIN = 'casper',
}

const NodeAddress: Record<Network, string> = {
  [Network.LOCAL]: 'http://localhost:11101',
  [Network.TEST]: `https://testnet.casper.validationcloud.io/v1/${process.env.VALIDATION_CLOUD_KEY}`,
  [Network.MAIN]: ``,
};

const CEP78Contract = {
  [Network.LOCAL]: {
    contractHash: 'hash-392a143b1bd55e077d41a8d45f7c353441dd1395c3e4b9c2cfee2d019dfbbb0e',
    packageHash: 'hash-d1f847493d95a6c887c6a4c8d1ddd53a0b42d73eb9f37e18f29b3323bf9bc94a',
  },
  [Network.TEST]: {
    contractHash: 'hash-1094f747e47bfe9fbab68c042411c2f381cd834b02515a3433ac0f38ff9677c9',
    packageHash: 'hash-4c4e1298ca4dc7bb99a36b43bc8ab6333a083fe91b0549dbb4b0e1b004fa1c38',
  },
  [Network.MAIN]: { contractHash: '', packageHash: '' },
};

const MinterContract = {
  [Network.LOCAL]: {
    contractHash: 'hash-07791f54a0a7e7211f062316c445825d2b51d382c76fc3f782ba18186b235d7e',
    packageHash: 'hash-560609403338e375b608bfb9373879cc89449d9312d1a3e6647b62430ce3e9e5',
  },
  [Network.TEST]: {
    contractHash: 'hash-955209e117da90eb653c95252e90dcd212f6e60d6cb94b78decf76c247dfd995',
    packageHash: 'hash-4f6c75d280bb823da4bce3b13569de2acaace0d6e98a527a1ca41eef97b4762d',
  },
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
