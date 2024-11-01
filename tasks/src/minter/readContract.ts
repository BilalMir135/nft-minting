import { CasperClient, Contracts, CLPublicKey, CLByteArray, CLPublicKeyTag } from 'casper-js-sdk';
import { BigNumber } from '@ethersproject/bignumber';

import { NODE_ADDRESS, MINTER_CONTRACT } from '../constants';

const casperClient = new CasperClient(NODE_ADDRESS);
const contract = new Contracts.Contract(casperClient);
contract.setContractHash(MINTER_CONTRACT.contractHash, MINTER_CONTRACT.packageHash);

export async function readContract() {
  const admin: CLByteArray = await contract.queryContractData(['admin']);
  const fundManager: CLByteArray = await contract.queryContractData(['fund_manager']);
  const mintFee: BigNumber = await contract.queryContractData(['mint_fee']);
  const cep78ContractHash: CLByteArray = await contract.queryContractData(['cep78_package_hash']);

  // const debug = await contract.queryContractData(['debug']);
  // const abc = await contract.queryContractData(['abc']);
  // const res = await contract.queryContractData(['res']);

  console.log('admin', new CLPublicKey(admin.data, CLPublicKeyTag.ED25519).toHex());
  console.log('fundManager', new CLPublicKey(fundManager.data, CLPublicKeyTag.ED25519).toHex());
  console.log('mintFee', mintFee.toString());
  console.log(
    'cep78ContractHash',
    new CLPublicKey(cep78ContractHash.data, CLPublicKeyTag.ED25519).toHex()
  );

  // console.log('debug', debug);
  // console.log('abc', abc);
  // console.log('res', res);
}
