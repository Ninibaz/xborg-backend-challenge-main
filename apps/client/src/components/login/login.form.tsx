import { LoadingButton } from '@mui/lab';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { login } from '../../axios/user/requests';
import { connectWallet, signInWithEthereum } from '../../blockchain/siwe';
import { PROFILE } from '../../config/routes';
import { useUserSession } from '../../providers/user-session.provider';
import { Flex } from '../common/flex';

export const LoginForm = () => {
  const { push } = useRouter();
  const { setSessionCookie } = useUserSession();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const logIn = async () => {
    setIsSubmitting(true);

    const accounts = await connectWallet();

    if (accounts && accounts?.length) {
      const signed = await signInWithEthereum();

      if (signed?.message && signed?.signature) {
        const loginRes = await login({
          message: signed.message,
          signature: signed.signature,
        }).catch((error) => {
          // Do some real error handling here e.g. render a modal
          console.error(error.message);
        });

        if (loginRes?.data) {
          setSessionCookie(loginRes.data.token);
          push(PROFILE);
        }
      }
    }

    setIsSubmitting(false);
  };

  return (
    <Box mt={3}>
      <LoadingButton
        onClick={logIn}
        loading={isSubmitting}
        variant="contained"
        fullWidth
        sx={{ minHeight: '44px' }}
      >
        <Flex
          sx={{ alignItems: 'center', display: isSubmitting ? 'none' : 'flex' }}
        >
          <Image
            src={'/images/svg/metamask.svg'}
            height={25}
            width={25}
            alt=""
          />
          <Typography sx={{ ml: 1 }}>Login with Metamask</Typography>
        </Flex>
      </LoadingButton>
    </Box>
  );
};
