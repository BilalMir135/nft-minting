import { Keys } from 'casper-js-sdk';
import path from 'path';

const AdminSecretKeyPath = path.resolve(__dirname, '../keys/admin_secret_key.pem');
const User1SecretKeyPath = path.resolve(__dirname, '../keys/user1_secret_key.pem');

export const AdmainKeypair = Keys.Ed25519.loadKeyPairFromPrivateFile(AdminSecretKeyPath);
export const User1Keypair = Keys.Ed25519.loadKeyPairFromPrivateFile(User1SecretKeyPath);
