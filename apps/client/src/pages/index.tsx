import { Box, Container, Typography } from '@mui/material';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <Box>
      <Container maxWidth="lg" sx={{ mt: 12 }}>
        <Typography variant="h2">Hello</Typography>
        <Typography variant="h3">Welcome to XBorg</Typography>
      </Container>
    </Box>
  );
};

export default Home;
