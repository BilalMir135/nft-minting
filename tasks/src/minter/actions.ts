import { MinterClient } from './client';
import { NETWORK, NODE_ADDRESS, MINTER_CONTRACT } from '../constants';
import { AdminKeypair, User1Keypair } from '../accounts';

const minterClient = new MinterClient(NODE_ADDRESS, NETWORK);
minterClient.setContractHash(MINTER_CONTRACT.contractHash, MINTER_CONTRACT.packageHash);

//only admin
export async function setWhitelist() {
  const users = [
    {
      accountHash: User1Keypair.publicKey.toAccountHashStr(),
      value: true,
    },
    {
      accountHash: 'account-hash-d6aacbe25dffddbde464bf53cd663a63821b1796e72e980bdbf5b1eae7935bfe',
      value: true,
    },
    {
      accountHash: 'account-hash-b0d9133bcafa2340a67e08b8776bee58a76855347b53f13123fc1bc4feb507c1',
      value: true,
    },
    {
      accountHash: 'account-hash-0edef6ff850f4ca98ba4d2889a9e33d2c5b7e601a32b9aa7332299aaa69ebcbd',
      value: true,
    },
  ];

  const deploy = minterClient.whitelist('set_whitelist', { users }, AdminKeypair.publicKey, [
    AdminKeypair,
  ]);

  const deployHash = await deploy.send(NODE_ADDRESS);
  console.log('deployHash', deployHash);
}

//only admin
export async function setConfig() {
  const deploy = minterClient.setConfig(
    { adminAccountHash: User1Keypair.publicKey.toAccountHashStr() },
    AdminKeypair.publicKey,
    [AdminKeypair]
  );

  const deployHash = await deploy.send(NODE_ADDRESS);
  console.log('deployHash', deployHash);
}

//only admin
export async function freeMint() {
  const deploy = minterClient.freeMint(
    {
      nftOwnerAccountHash: User1Keypair.publicKey.toAccountHashStr(),
      nftCount: 1000,
    },
    AdminKeypair.publicKey,
    [AdminKeypair]
  );
  const deployHash = await deploy.send(NODE_ADDRESS);
  console.log('deployHash', deployHash);
}

export async function nativeMint() {
  const NFT_COUNT = 20;
  const mintCost = await minterClient.getMintCost(NFT_COUNT);
  const deploy = minterClient.nativeMint(
    {
      nftOwnerAccountHash: User1Keypair.publicKey.toAccountHashStr(),
      nftCount: NFT_COUNT,
      minterPackageHash: MINTER_CONTRACT.packageHash,
      amount: mintCost,
    },
    User1Keypair.publicKey,
    [User1Keypair]
  );
  const deployHash = await deploy.send(NODE_ADDRESS);
  console.log('deployHash', deployHash);
}

export async function readMinterContract() {
  const [
    admin,
    fundManager,
    cep78PackageHash,
    mintFee,
    mintCount,
    onlyWhitelist,
    allowMint,
    maxMint,
  ] = await Promise.all([
    minterClient.admin(),
    minterClient.fundManager(),
    minterClient.cep78PackageHash(),
    minterClient.mintFee(),
    minterClient.mintCount(),
    minterClient.onlyWhitelist(),
    minterClient.allowMint(),
    minterClient.maxMint(),
  ]);

  console.log({
    admin: admin.accountHash,
    fundManager: fundManager.accountHash,
    cep78PackageHash: cep78PackageHash.hash,
    mintFee: mintFee.toString(),
    mintCount: mintCount.toString(),
    onlyWhitelist,
    allowMint,
    maxMint: maxMint.toString(),
  });
}

export async function isAccWhitelistedToMint() {
  const [admin, user1] = await Promise.all([
    minterClient.isWhitelisted(AdminKeypair.publicKey.toAccountHashStr()),
    minterClient.isWhitelisted(User1Keypair.publicKey.toAccountHashStr()),
  ]);

  console.log('whitelisted => ', { admin, user1 });
}
