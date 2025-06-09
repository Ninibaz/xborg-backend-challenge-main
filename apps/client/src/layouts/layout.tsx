import { Box } from '@mui/material';
import { ReactNode } from 'react';
import { Navbar } from './navbar/navbar';

export interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box>
      <Navbar />
      {children}
    </Box>
  );
};
