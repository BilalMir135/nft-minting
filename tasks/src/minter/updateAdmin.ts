import { CasperClient, Contracts, RuntimeArgs } from 'casper-js-sdk';

import { NODE_ADDRESS, NETWORK, MINTER_CONTRACT } from '../constants';
import { AdmainKeypair, User1Keypair } from '../accounts';

const casperClient = new CasperClient(NODE_ADDRESS);
const contract = new Contracts.Contract(casperClient);
contract.setContractHash(MINTER_CONTRACT.contractHash, MINTER_CONTRACT.packageHash);

export async function updateAdmin() {
  const runtimeArguments = RuntimeArgs.fromMap({
    admin: User1Keypair.publicKey,
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
