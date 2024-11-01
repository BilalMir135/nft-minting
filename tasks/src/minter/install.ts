import {
  CasperClient,
  Contracts,
  RuntimeArgs,
  CLValueBuilder,
  CLPublicKey,
  CLKey,
  CLAccountHash,
} from 'casper-js-sdk';
import fs from 'fs';
import path from 'path';

import { NETWORK, NODE_ADDRESS, CEP78_Contract_KEYS } from '../constants';
import { AdmainKeypair, User1Keypair } from '../accounts';

const MINTER_CONTRACT_WASM = path.resolve(
  __dirname,
  '../../../contract/target/wasm32-unknown-unknown/release/contract.wasm'
);
const casperClient = new CasperClient(NODE_ADDRESS);
const contract = new Contracts.Contract(casperClient);
const contractWasm = new Uint8Array(fs.readFileSync(MINTER_CONTRACT_WASM).buffer);

export async function installMinterContract() {
  const adminPublicKey = AdmainKeypair.publicKey.toAccountHashStr();
  const contractHashAsByteArray = Uint8Array.from(
    Buffer.from(CEP78_Contract_KEYS.contractHash.slice(5), 'hex')
  );
  const cep78ContractHash = new CLKey(new CLAccountHash(contractHashAsByteArray));

  const runtimeArguments = RuntimeArgs.fromMap({
    // admin: CLPublicKey.fromHex(adminPublicKey),
    // admin: new CLKey(new CLAccountHash(AdmainKeypair.publicKey.data)),
    admin: AdmainKeypair.publicKey,
    fund_manager: AdmainKeypair.publicKey,
    cep78_package_hash: cep78ContractHash,
    mint_fee: CLValueBuilder.u256(80e9),
  });

  const deploy = contract.install(
    contractWasm,
    runtimeArguments,
    (100 * 1e9).toString(),
    User1Keypair.publicKey,
    NETWORK,
    [User1Keypair]
  );

  const deployHash = await casperClient.putDeploy(deploy);
  console.log('deployHash', deployHash);

  // const deploy = await casperClient.getDeploy(
  //   '5813e80313ca4891dfa1c51040420e8f831dc37cdfa36af7dd9644932a7a9508'
  // );

  // const executionResults = deploy[1].execution_results;

  // console.log('deployHash', executionResults);
}

// hash-a72b02075a3fa7b9ab445be55241147016559a32c82a2d3c07128e3a9c96c545
