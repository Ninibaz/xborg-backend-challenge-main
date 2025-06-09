import { Container, Stack, Typography } from '@mui/material';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { Flex } from '../components/common/flex';
import { parseCookies } from '../utils/cookies';
import {
  SESSION_COOKIE,
  useUserSession,
} from '../providers/user-session.provider';
import { ERROR, LOGIN } from '../config/routes';
import { getUser } from '../axios/user/requests';
import { User } from '../axios/user/types';
import { UserDataContainer } from '../components/profile/user-data.container';
import { useEffect } from 'react';
import { buildAuthorizationHeader } from '../axios/config';

interface ProfilePageProps {
  user: User;
}

const Profile: NextPage<ProfilePageProps> = ({ user }) => {
  const { setUser } = useUserSession();

  useEffect(() => {
    setUser(user);
  }, [user]);

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Flex
        sx={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="xs">
          <Stack>
            <Stack gap={2} sx={{ mb: 6 }}>
              <Typography
                variant="h3"
                color="primary"
                sx={{ fontWeight: '500' }}
              >
                Profile
              </Typography>
              <Typography>Manage your personal information</Typography>
            </Stack>

            <UserDataContainer />
          </Stack>
        </Container>
      </Flex>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const cookies = parseCookies(ctx.req.headers.cookie);

    if (!cookies || !cookies[SESSION_COOKIE]) {
      return {
        redirect: {
          destination: LOGIN,
          permanent: false,
        },
        props: {},
      };
    }

    const userRes = await getUser(
      buildAuthorizationHeader(cookies[SESSION_COOKIE])
    );

    return {
      props: {
        user: userRes.data,
      },
    };
  } catch (error: any) {
    // Do some real error handling here (verbose logging, modify redirects etc.)
    console.error(`Get user profile Error: ${error.message}`);

    return {
      redirect: {
        destination: ERROR,
        permanent: false,
      },
      props: {},
    };
  }
};

export default Profile;
