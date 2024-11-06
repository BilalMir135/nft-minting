import { RuntimeArgs, CLValueBuilder } from 'casper-js-sdk';

import { AdmainKeypair, User1Keypair } from '../accounts';
import { NETWORK } from '../constants';
import { getMinterContract, getCasperClient } from '../utils/helpers';
import { accHashToKey } from '../utils/input';

export async function mintNFT() {
  const casperClient = getCasperClient();
  const contract = getMinterContract();

  const runtimeArguments = RuntimeArgs.fromMap({
    nft_owner: accHashToKey(User1Keypair.publicKey.toAccountHashStr()),
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
