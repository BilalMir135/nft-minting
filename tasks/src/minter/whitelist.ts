import { RuntimeArgs, CLValueBuilder } from 'casper-js-sdk';

import { AdmainKeypair, User1Keypair } from '../accounts';
import { NETWORK } from '../constants';
import { getMinterContract, getCasperClient } from '../utils/helpers';
import { accHashToKey } from '../utils/input';

const accounts = [User1Keypair.publicKey.toAccountHashStr()];
const values = [true];

export async function setWhitelist() {
  const casperClient = getCasperClient();
  const contract = getMinterContract();

  const runtimeArguments = RuntimeArgs.fromMap({
    whitelist_accounts: CLValueBuilder.list(accounts.map(acount => accHashToKey(acount))),
    whitelist_values: CLValueBuilder.list(values.map(value => CLValueBuilder.bool(value))),
  });

  const deploy = contract.callEntrypoint(
    'set_whitelist',
    runtimeArguments,
    AdmainKeypair.publicKey,
    NETWORK,
    (20 * 1e9).toString(),
    [AdmainKeypair]
  );

  const deployHash = await casperClient.putDeploy(deploy);
  console.log('deployHash', deployHash);
}
