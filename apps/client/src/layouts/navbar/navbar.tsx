import { AppBar, Container } from '@mui/material';
import { ReactElement } from 'react';
import { NavbarDesktop } from './navbar-desktop';
import { NavbarHeight } from '../constants';

interface ElevationScrollProps {
  children: ReactElement;
}

export const Navbar = () => {
  return (
    <AppBar
      position="static"
      sx={{
        height: { xs: NavbarHeight.xs, md: NavbarHeight.md },
        backgroundColor: 'black',
        color: 'grey.700',
      }}
    >
      <Container maxWidth="xl" sx={{ height: '100%', position: 'relative' }}>
        <NavbarDesktop />
      </Container>
    </AppBar>
  );
};
