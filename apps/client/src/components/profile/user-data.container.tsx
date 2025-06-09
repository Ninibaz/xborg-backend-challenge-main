import { Avatar, Stack, Typography } from '@mui/material';
import { useUserSession } from '../../providers/user-session.provider';
import { DataField } from './data-field';

export const UserDataContainer = () => {
  const { user } = useUserSession();

  return (
    <Stack gap={3}>
      <Avatar sx={{ height: 60, width: 60 }}>
        {user?.userName && (
          <Typography sx={{ fontSize: '35px' }}>{user.userName[0]}</Typography>
        )}
      </Avatar>

      <DataField title="Username" data={user?.userName} />

      <DataField title="First name" data={user?.profile?.firstName} />

      <DataField title="Last name" data={user?.profile?.lastName} />

      <DataField title="Email" data={user?.email} />

      <DataField title="Location" data={user?.profile?.location} />
    </Stack>
  );
};
