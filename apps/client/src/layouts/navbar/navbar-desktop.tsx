import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Flex } from '../../components/common/flex';
import { HOME, LOGIN, PROFILE, SIGNUP } from '../../config/routes';
import { useUserSession } from '../../providers/user-session.provider';

export const NavbarDesktop = () => {
  const { push } = useRouter();

  const { isAuthenticated, deleteSessionCookie } = useUserSession();

  const logout = () => {
    deleteSessionCookie();
    push(HOME);
  };

  return (
    <Flex
      sx={{
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link href={HOME} style={{ textDecoration: 'none' }}>
        <Typography variant="h6" color="white">
          Xborg
        </Typography>
      </Link>

      {isAuthenticated ? (
        <Flex sx={{ justifyContent: 'flex-end' }}>
          <Box sx={{ mr: 1 }}>
            <Link href={PROFILE}>
              <Button
                color="secondary"
                sx={{
                  minHeight: '40px',
                  minWidth: '100px',
                  textTransform: 'none',
                }}
                variant="contained"
              >
                Profile
              </Button>
            </Link>
          </Box>
          <Button
            sx={{
              minHeight: '40px',
              minWidth: '100px',
              textTransform: 'none',
            }}
            variant="contained"
            onClick={logout}
          >
            Logout
          </Button>
        </Flex>
      ) : (
        <Flex sx={{ justifyContent: 'flex-end' }}>
          <Box sx={{ mr: 1 }}>
            <Link href={LOGIN}>
              <Button
                sx={{
                  minHeight: '40px',
                  minWidth: '100px',
                  textTransform: 'none',
                }}
                variant="outlined"
              >
                Login
              </Button>
            </Link>
          </Box>

          <Box>
            <Link color={'#FFFFFF'} href={SIGNUP}>
              <Button
                sx={{
                  minHeight: '40px',
                  minWidth: '100px',
                  textTransform: 'none',
                }}
                variant="contained"
              >
                Sign up
              </Button>
            </Link>
          </Box>
        </Flex>
      )}
    </Flex>
  );
};
