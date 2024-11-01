import { config } from 'dotenv';
config();

import { CLPublicKey, CLAccountHash, CLKey } from 'casper-js-sdk';

import { installMinterContract } from './minter/install';
import { readContract } from './minter/readContract';
import { updateAdmin } from './minter/updateAdmin';

import { AdmainKeypair, User1Keypair } from './accounts';

async function main() {
  // console.log('ab', new CLKey(new CLAccountHash(AdmainKeypair.publicKey.data)));
  // await installMinterContract();

  // await readContract();

  await updateAdmin();

  // console.log('admin', AdmainKeypair.publicKey.toAccountHashStr());
  // console.log('user', User1Keypair.publicKey.toAccountHashStr());
}

main();
