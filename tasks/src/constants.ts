export enum Network {
  LOCAL = 'casper-net-1',
  TEST = 'casper-test',
  MAIN = 'casper',
}

const NodeAddress: Record<Network, string> = {
  [Network.LOCAL]: 'http://localhost:11101',
  [Network.TEST]: `https://testnet.casper.validationcloud.io/v1/${process.env.VALIDATION_CLOUD_KEY}`,
  [Network.MAIN]: `https://mainnet.casper.validationcloud.io/v1/${process.env.VALIDATION_CLOUD_KEY_MAIN}`,
};

const CEP78Contract = {
  [Network.LOCAL]: {
    contractHash: 'hash-100f84e65b6918d896c5fc45870551e5373663107dc361e3356ac6997a3e7700',
    packageHash: 'hash-8f86deb1ac694d81270becf7301f4f073704b133acbf0561f2fe6278aa813a3c',
  },
  [Network.TEST]: {
    contractHash: 'hash-1094f747e47bfe9fbab68c042411c2f381cd834b02515a3433ac0f38ff9677c9',
    packageHash: 'hash-4c4e1298ca4dc7bb99a36b43bc8ab6333a083fe91b0549dbb4b0e1b004fa1c38',
  },
  [Network.MAIN]: {
    contractHash: 'hash-9181c48193d9630144906428a91c63bef12817836aed1f33332a72803c9a1795',
    packageHash: 'hash-ad0cd4ef3cfd9e7222706786e51773af771f063ecce4606282999a7a6d6ac495',
  },
};

const MinterContract = {
  [Network.LOCAL]: {
    contractHash: 'hash-1b349329cda30830cb64564c1ee534c6dfe58c8e149886f3541c6c6f547c25fd',
    packageHash: 'hash-fafd7ffb4edccaa4565192075ac81fdeeffe8690636e2ef211f4cc1a28a64725',
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
