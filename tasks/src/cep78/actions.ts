import { CEP78Client, ConfigurableVariables } from 'casper-cep78-js-client';
import { BigNumber } from '@ethersproject/bignumber';

import { CustomCEP78Client } from './client';
import { AdmainKeypair, User1Keypair } from '../accounts';
import { NODE_ADDRESS, NETWORK, CEP78_CONTRACT, MINTER_CONTRACT } from '../constants';
import { HashType } from '../utils/input';

const cep78Client = new CustomCEP78Client(NODE_ADDRESS, NETWORK);
cep78Client.setContractHash(CEP78_CONTRACT.contractHash, CEP78_CONTRACT.packageHash);

export async function mint() {
  const mintDeploy = cep78Client.mint(
    {
      collectionName: 'Test Collection',
      owner: User1Keypair.publicKey,
      meta: {
        name: 'John Doe',
        symbol: 'abc',
        token_uri: 'https://www.barfoo.com',
      },
    },
    { useSessionCode: true },
    (6 * 1e9).toString(),
    AdmainKeypair.publicKey,
    [AdmainKeypair]
  );

  const deployHash = await mintDeploy.send(NODE_ADDRESS);
  console.log('deployHash', deployHash);
}

//caller => only installer
export async function addNewAclWhitelist() {
  const aclWhitelist = [
    { type: HashType.ACCOUNT, hash: AdmainKeypair.publicKey.toAccountHashStr() },
    { type: HashType.CONTRACT, hash: MINTER_CONTRACT.packageHash },
    { type: HashType.CONTRACT, hash: MINTER_CONTRACT.contractHash },
  ];

  const aclDeploy = cep78Client.setVariables(
    {
      aclWhitelist,
    },
    (6 * 1e9).toString(),
    User1Keypair.publicKey,
    [User1Keypair]
  );

  const deployHash = await aclDeploy.send(NODE_ADDRESS);
  console.log('deployHash', deployHash);
}

export async function readCep78Contract() {
  const isAccountWhitelisted = await cep78Client.isAccountWhitelisted(AdmainKeypair.publicKey);
  console.log('isAccountWhitelisted', isAccountWhitelisted);

  const isContractWhitelisted = await cep78Client.isContractWhitelisted(
    MINTER_CONTRACT.packageHash
  );
  console.log('isContractWhitelisted', isContractWhitelisted);

  const totalMints: BigNumber = await cep78Client.numOfMintedTokens();
  console.log('totalMints', totalMints.toString());

  const balance = await cep78Client.getBalanceOf(User1Keypair.publicKey);
  console.log('balance', balance);

  const ownerOf = await cep78Client.getOwnerOf('0');
  console.log('ownerOf', ownerOf);

  const metdatda = await cep78Client.getMetadataOf('0');
  console.log('metdatda', metdatda);
}
