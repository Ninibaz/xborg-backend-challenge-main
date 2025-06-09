import { Container, Typography } from '@mui/material';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Link from 'next/link';
import { Flex } from '../components/common/flex';
import { LoginForm } from '../components/login/login.form';
import { PROFILE, SIGNUP } from '../config/routes';
import { SESSION_COOKIE } from '../providers/user-session.provider';
import { parseCookies } from '../utils/cookies';

const Login: NextPage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Flex
        sx={{
          width: { xs: '100%', md: '50%' },
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="xs">
          <Flex flexDirection="column" sx={{ mb: 6 }}>
            <Typography variant="h5">Login to</Typography>
            <Typography variant="h3" color="primary" sx={{ fontWeight: '500' }}>
              Xborg
            </Typography>
          </Flex>
          <Flex
            sx={{
              flexDirection: 'column',
            }}
          >
            <LoginForm />
            <Flex sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>
                Dont have an account?
              </Typography>
              <Link href={SIGNUP}>
                <Typography variant="subtitle2" sx={{ ml: 1 }}>
                  Sign up
                </Typography>
              </Link>
            </Flex>
          </Flex>
        </Container>
      </Flex>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const cookies = parseCookies(ctx.req.headers.cookie);

  if (cookies && cookies[SESSION_COOKIE]) {
    return {
      redirect: {
        destination: PROFILE,
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};

export default Login;
