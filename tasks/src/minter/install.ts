import {
  CasperClient,
  Contracts,
  RuntimeArgs,
  CLValueBuilder,
  CLByteArray,
  AccessRights,
} from 'casper-js-sdk';
import fs from 'fs';
import path from 'path';

import { NETWORK, NODE_ADDRESS, CEP78_CONTRACT } from '../constants';
import { AdmainKeypair, User1Keypair } from '../accounts';
import { accHashToKey, hashToKey, hashToUnit8Array, HashType } from '../utils/input';

const MINTER_CONTRACT_WASM = path.resolve(
  __dirname,
  '../../../contract/target/wasm32-unknown-unknown/release/contract.wasm'
);

// const ADMIN_ACCOUNT_HASH =
//   'account-hash-77bd81299efc626bd029edf887823e52235e3550bfa210d621ad4a5487b7ed1f';
const ADMIN_ACCOUNT_HASH = AdmainKeypair.publicKey.toAccountHashStr();

const casperClient = new CasperClient(NODE_ADDRESS);
const contract = new Contracts.Contract(casperClient);
const contractWasm = new Uint8Array(fs.readFileSync(MINTER_CONTRACT_WASM).buffer);

export async function installMinterContract() {
  const runtimeArguments = RuntimeArgs.fromMap({
    admin: accHashToKey(ADMIN_ACCOUNT_HASH),
    fund_manager: accHashToKey(ADMIN_ACCOUNT_HASH),
    cep78_package_hash: hashToKey(CEP78_CONTRACT.packageHash),
    mint_fee: CLValueBuilder.u256(80e9),
    only_whitelist: CLValueBuilder.bool(true),
  });

  const deploy = contract.install(
    contractWasm,
    runtimeArguments,
    (150 * 1e9).toString(),
    User1Keypair.publicKey,
    NETWORK,
    [User1Keypair]
  );

  const deployHash = await casperClient.putDeploy(deploy);
  console.log('deployHash', deployHash);
}
