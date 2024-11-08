import { RuntimeArgs, CLValueBuilder, Contracts } from 'casper-js-sdk';
import { BigNumber } from '@ethersproject/bignumber';
import path from 'path';
import fs from 'fs';

import { AdmainKeypair, User1Keypair } from '../accounts';
import { NETWORK, MINTER_CONTRACT } from '../constants';
import { getMinterContract, getCasperClient } from '../utils/helpers';
import { accHashToKey, hashToKey } from '../utils/input';

export async function mintNFT() {
  const casperClient = getCasperClient();
  const contract = getMinterContract();

  const runtimeArguments = RuntimeArgs.fromMap({
    nft_owner: accHashToKey(AdmainKeypair.publicKey.toAccountHashStr()),
    count: CLValueBuilder.u64(3),
  });

  const deploy = contract.callEntrypoint(
    'free_mint',
    runtimeArguments,
    AdmainKeypair.publicKey,
    NETWORK,
    (20 * 1e9).toString(),
    [AdmainKeypair]
  );

  const deployHash = await casperClient.putDeploy(deploy);
  console.log('deployHash', deployHash);
}

async function getMintCost(count: number) {
  const contract = getMinterContract();
  const mintFee: BigNumber = await contract.queryContractData(['mint_fee']);
  return mintFee.mul(count).toString();
}

const MINT_SESSION_WASM = path.resolve(
  __dirname,
  '../../../mint-session/target/wasm32-unknown-unknown/release/public_mint_call.wasm'
);

export async function nativeNFT() {
  const sessionWasm = new Uint8Array(fs.readFileSync(MINT_SESSION_WASM).buffer);
  const casperClient = getCasperClient();
  const contract = new Contracts.Contract(casperClient);

  const count = 1;
  const minCost = await getMintCost(count);

  const runtimeArguments = RuntimeArgs.fromMap({
    nft_owner: accHashToKey(User1Keypair.publicKey.toAccountHashStr()),
    count: CLValueBuilder.u64(1),
    minter_package_hash: hashToKey(MINTER_CONTRACT.packageHash),
    amount: CLValueBuilder.u512(minCost),
  });

  const deploy = contract.install(
    sessionWasm,
    runtimeArguments,
    (20 * 1e9).toString(),
    User1Keypair.publicKey,
    NETWORK,
    [User1Keypair]
  );

  const deployHash = await casperClient.putDeploy(deploy);
  console.log('deployHash', deployHash);
}
