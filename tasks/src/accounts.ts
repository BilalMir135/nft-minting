import { Keys } from 'casper-js-sdk';
import path from 'path';

import { Network, NETWORK } from './constants';

const AdminLocalSecretKeyPath = path.resolve(__dirname, '../keys/admin_secret_key.pem');
const User1LocalSecretKeyPath = path.resolve(__dirname, '../keys/user1_secret_key.pem');
const AdminTestSecretKeyPath = path.resolve(__dirname, '../keys/admin_testnet_secret_key.pem');

const AdminLocalKeypair = Keys.Ed25519.loadKeyPairFromPrivateFile(AdminLocalSecretKeyPath);
const User1LocalKeypair = Keys.Ed25519.loadKeyPairFromPrivateFile(User1LocalSecretKeyPath);
const AdminTestKeypair = Keys.Ed25519.loadKeyPairFromPrivateFile(AdminTestSecretKeyPath);

const ACCOUNTS = {
  [Network.LOCAL]: {
    Admin: AdminLocalKeypair,
    User1: User1LocalKeypair,
  },
  [Network.TEST]: {
    Admin: AdminTestKeypair,
    User1: User1LocalKeypair,
  },
  [Network.MAIN]: {
    Admin: AdminLocalKeypair,
    User1: User1LocalKeypair,
  },
};

export const AdminKeypair = ACCOUNTS[NETWORK].Admin;
export const User1Keypair = ACCOUNTS[NETWORK].User1;
