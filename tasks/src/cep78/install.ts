import {
  CEP78Client,
  NFTOwnershipMode,
  NFTKind,
  NFTMetadataKind,
  NFTIdentifierMode,
  MetadataMutability,
  MintingMode,
  OwnerReverseLookupMode,
  EventsMode,
  NFTHolderMode,
  WhitelistMode,
  BurnMode,
} from 'casper-cep78-js-client';
import path from 'path';
import fs from 'fs';

import { User1Keypair } from '../accounts';
import { NODE_ADDRESS, NETWORK } from '../constants';

const CEP78_CONTRACT_WASM = path.resolve(__dirname, './contract/contract.wasm');

const cep78Client = new CEP78Client(NODE_ADDRESS, NETWORK);
const contractWasm = new Uint8Array(fs.readFileSync(CEP78_CONTRACT_WASM).buffer);

export async function installCep78() {
  const installDeploy = cep78Client.install(
    {
      collectionName: 'Test Collection',
      collectionSymbol: 'TC-01',
      totalTokenSupply: '10000',
      ownershipMode: NFTOwnershipMode.Transferable,
      nftKind: NFTKind.Digital,
      holderMode: NFTHolderMode.Mixed,
      whitelistMode: WhitelistMode.Unlocked,
      mintingMode: MintingMode.Acl,
      nftMetadataKind: NFTMetadataKind.NFT721,
      identifierMode: NFTIdentifierMode.Ordinal,
      metadataMutability: MetadataMutability.Immutable,
      burnMode: BurnMode.NonBurnable,
      ownerReverseLookupMode: OwnerReverseLookupMode.Complete,
      eventsMode: EventsMode.CES,
    },
    (600 * 1e9).toString(),
    User1Keypair.publicKey,
    [User1Keypair],
    contractWasm
  );

  const deployHash = await installDeploy.send(NODE_ADDRESS);
  console.log('deployHash', deployHash);
}
