import { CLPublicKey, CLByteArray, CLPublicKeyTag } from 'casper-js-sdk';
import { BigNumber } from '@ethersproject/bignumber';

import { getMinterContract } from '../utils/helpers';

export async function readContract() {
  const contract = getMinterContract();

  const admin: CLByteArray = await contract.queryContractData(['admin']);
  const fundManager: CLByteArray = await contract.queryContractData(['fund_manager']);
  const mintFee: BigNumber = await contract.queryContractData(['mint_fee']);
  const cep78ContractHash: CLByteArray = await contract.queryContractData(['cep78_package_hash']);

  console.log('admin', new CLPublicKey(admin.data, CLPublicKeyTag.ED25519).toHex());
  console.log('fundManager', new CLPublicKey(fundManager.data, CLPublicKeyTag.ED25519).toHex());
  console.log('mintFee', mintFee.toString());
  console.log(
    'cep78ContractHash',
    new CLPublicKey(cep78ContractHash.data, CLPublicKeyTag.ED25519).toHex()
  );
}
