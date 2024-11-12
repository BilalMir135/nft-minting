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
      nftCount: 2,
    },
    AdminKeypair.publicKey,
    [AdminKeypair]
  );
  const deployHash = await deploy.send(NODE_ADDRESS);
  console.log('deployHash', deployHash);
}

export async function nativeMint() {
  const mintCost = await minterClient.getMintCost(2);
  const deploy = minterClient.nativeMint(
    {
      nftOwnerAccountHash: User1Keypair.publicKey.toAccountHashStr(),
      nftCount: 2,
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
  const [admin, fundManager, cep78PackageHash, mintFee, mintCount, onlyWhitelist, allowMint] =
    await Promise.all([
      minterClient.admin(),
      minterClient.fundManager(),
      minterClient.cep78PackageHash(),
      minterClient.mintFee(),
      minterClient.mintCount(),
      minterClient.onlyWhitelist(),
      minterClient.allowMint(),
    ]);

  console.log({
    admin: admin.accountHash,
    fundManager: fundManager.accountHash,
    cep78PackageHash: cep78PackageHash.hash,
    mintFee: mintFee.toString(),
    mintCount: mintCount.toString(),
    onlyWhitelist,
    allowMint,
  });
}

export async function isAccWhitelistedToMint() {
  const [admin, user1] = await Promise.all([
    minterClient.isWhitelisted(AdminKeypair.publicKey.toAccountHashStr()),
    minterClient.isWhitelisted(User1Keypair.publicKey.toAccountHashStr()),
  ]);

  console.log('whitelisted => ', { admin, user1 });
}
