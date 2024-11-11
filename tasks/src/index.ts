import { config } from 'dotenv';
config();

import { CLPublicKey, CLAccountHash, CLKey } from 'casper-js-sdk';

import { installMinterContract } from './minter/install';
import { readContract } from './minter/readContract';
import { updateAdmin } from './minter/updateAdmin';
import { mintNFT, nativeMint, cep18Mint } from './minter/mint';
import { setWhitelist } from './minter/whitelist';

import { installCep78 } from './cep78/install';
import { mint, addNewAclWhitelist, readCep78Contract, registerOwner } from './cep78/actions';

import { installCep18 } from './cep18/install';
import { mintCep18, readCep18Contract, approveCep18 } from './cep18/actions';

import { AdmainKeypair, User1Keypair } from './accounts';

async function main() {
  //step # 01
  // await installCep78();
  //step # 02
  // await installMinterContract();
  //step # 03
  // await addNewAclWhitelist();
  //setp # 04
  // await mintNFT();
  // await nativeMint();
  // await cep18Mint();

  // await installCep18();
  // await mintCep18();
  // await readCep18Contract();
  // await approveCep18();

  // await setWhitelist();
  await readCep78Contract();
  // await registerOwner();
  // await mint();
  // console.log('ab', new CLKey(new CLAccountHash(AdmainKeypair.publicKey.data)));
  // await installMinterContract();
  // await readContract();
  // await updateAdmin();
  // console.log('admin', AdmainKeypair.publicKey.toAccountHashStr());
  // console.log('user', User1Keypair.publicKey.toAccountHashStr());
}

main();
