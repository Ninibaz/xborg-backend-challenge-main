import { BrowserProvider } from 'ethers';
import { SiweMessage } from 'siwe';
import { getNonce } from '../axios/siwe/requests';

let domain: string | undefined;
let origin: string | undefined;

if (typeof window !== 'undefined') {
  domain = window.location.host;
  origin = window.location.origin;
}

const provider = new BrowserProvider(
  // @ts-ignore
  typeof window !== 'undefined' ? window?.ethereum : undefined
);

const createSiweMessage = async (address: string, statement: string) => {
  const nonceRes = await getNonce(address);

  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId: 1,
    nonce: nonceRes.data,
  });

  return { message: message.prepareMessage(), nonce: nonceRes.data };
};

export const connectWallet = async () => {
  return provider
    .send('eth_requestAccounts', [])
    .catch(() => console.error('User rejected request'));
};

export const signInWithEthereum = async () => {
  const signer = await provider.getSigner().catch((error) => {
    console.error('Failed to get signer');
    throw error;
  });

  if (signer) {
    const { message, nonce } = await createSiweMessage(
      signer.address,
      'Sign in with Ethereum to the app.'
    );

    const signature = await signer.signMessage(message).catch((error) => {
      console.error('Failed to sign message');
      throw error;
    });

    return { message, nonce, signature };
  }
};
