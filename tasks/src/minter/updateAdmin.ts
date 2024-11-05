import { RuntimeArgs } from 'casper-js-sdk';

import { AdmainKeypair } from '../accounts';
import { NETWORK } from '../constants';
import { getMinterContract, getCasperClient } from '../utils/helpers';
import { accHashToKey } from '../utils/input';

const NEW_ADMIN_ACCOUNT_HASH =
  'account-hash-30cff6570de20edcc46b0c0b6cf8f27900b024c7832a64dcd075b2455e48b497';

export async function updateAdmin() {
  const casperClient = getCasperClient();
  const contract = getMinterContract();

  const runtimeArguments = RuntimeArgs.fromMap({
    admin: accHashToKey(NEW_ADMIN_ACCOUNT_HASH),
  });

  const deploy = contract.callEntrypoint(
    'update_admin',
    runtimeArguments,
    AdmainKeypair.publicKey,
    NETWORK, // or "casper-test" for Testnet
    '8000000000', // 1 CSPR (10^9 Motes)
    [AdmainKeypair]
  );

  const deployHash = await casperClient.putDeploy(deploy);
  console.log('deployHash', deployHash);
}
