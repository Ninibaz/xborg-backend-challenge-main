import { Stack, Typography } from '@mui/material';

interface DataFieldProps {
  title: string;
  data?: string;
}

export const DataField = ({ title, data }: DataFieldProps) => (
  <Stack>
    <Typography
      variant="caption"
      sx={{ pl: 1, fontWeight: 600, color: 'gray.dark' }}
    >
      {title}
    </Typography>
    <Typography
      variant="subtitle2"
      sx={{ pl: 1, fontWeight: 500, color: 'gray.dark' }}
    >
      {data || 'Not set'}
    </Typography>
  </Stack>
);
