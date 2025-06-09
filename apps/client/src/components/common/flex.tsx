import { Box, BoxProps } from '@mui/material';
import { forwardRef } from 'react';

export const Flex = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { sx, ...rest } = props;

  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        ...sx,
      }}
      {...rest}
    />
  );
});

Flex.displayName = 'Flex';
