import { Button, Container, Typography } from '@mui/material';
import { Flex } from './flex';
import { HOME } from '../../config/routes';
import Link from 'next/link';

export const NotFoundError = () => {
  return (
    <Container maxWidth="md">
      <Flex
        sx={{
          pt: 6,
          pb: 10,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 5 }}>
          Whoops, this is embarrassing.
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 5 }}>
          The page you are looking for does not exist. You can use the link
          below to navigate to the home page
        </Typography>

        <Flex sx={{ justifyContent: 'space-between' }}>
          <Link href={HOME}>
            <Button
              size="large"
              variant="contained"
              color="primary"
              sx={{ fontSize: '1.25rem' }}
            >
              Home
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Container>
  );
};
