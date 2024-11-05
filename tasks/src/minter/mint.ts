import { RuntimeArgs } from 'casper-js-sdk';

import { AdmainKeypair } from '../accounts';
import { NETWORK } from '../constants';
import { getMinterContract, getCasperClient } from '../utils/helpers';
import { accHashToKey } from '../utils/input';

export async function mintNFT() {
  const casperClient = getCasperClient();
  const contract = getMinterContract();

  const runtimeArguments = RuntimeArgs.fromMap({
    nft_owner: accHashToKey(AdmainKeypair.publicKey.toAccountHashStr()),
  });

  const deploy = contract.callEntrypoint(
    'free_mint',
    runtimeArguments,
    AdmainKeypair.publicKey,
    NETWORK, // or "casper-test" for Testnet
    '8000000000', // 1 CSPR (10^9 Motes)
    [AdmainKeypair]
  );

  const deployHash = await casperClient.putDeploy(deploy);
  console.log('deployHash', deployHash);
}
