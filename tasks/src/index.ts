import { config } from 'dotenv';
config();

import { installMinterContract } from './minter/install';
import {
  freeMint,
  setConfig,
  nativeMint,
  setWhitelist,
  readMinterContract,
  isAccWhitelistedToMint,
} from './minter/actions';

import { installCep78 } from './cep78/install';
import {
  addNewAclWhitelist,
  readCep78Contract,
  whitelistData,
  nftDataByAccount,
} from './cep78/actions';

async function main() {
  //cep78
  // await installCep78();
  // await addNewAclWhitelist();
  // await readCep78Contract();
  // await whitelistData();
  // await nftDataByAccount();
  //minter
  // await installMinterContract();
  // await setWhitelist();
  // await setConfig();
  await nativeMint();
  // await readMinterContract();
  // await isAccWhitelistedToMint();
}

main();
