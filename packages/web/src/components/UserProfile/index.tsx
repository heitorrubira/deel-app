import React from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { Avatar, Box, Paper, Typography } from '@mui/material';
import OneClickAddBalance from '../OneClickAddBalance';
import { useAddBalance } from '../../services';

export default function UserProfile() {
  const {profile, updateProfile} = useAuth();
  const [{ loading }, execute] = useAddBalance(profile?.id as number);

  const handleAddBalance = (amount: number) => {
    execute({ data: { amount }})
      .then((res) => {
        console.info('Balance added!', { res });
        updateProfile(res.data);
      })
      .catch((err) => {
        console.error('Error on add balance!', { amount, err });
        if (err.code === 'ERR_BAD_REQUEST' && err.response?.data) {
          alert(err.response.data);
        } else {
          alert('Unknow error on add balance!');
        }
      })
  };

  const fullName = `${profile?.firstName} ${profile?.lastName}`;
  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ flexDirection: 'row', display: 'flex' }}>
        <Box sx={{ flexGrow: 0, mr: 2 }}>
          <Avatar
            alt={fullName}
          >
            {profile?.firstName[0]}
            {profile?.lastName[0]}
          </Avatar>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Box mb={1}>
            <Typography variant="h5" >{fullName}</Typography>
          </Box>
          <Box>
            <Typography variant="h6">Balance: {profile?.balance}</Typography>
          </Box>
          <Box>
            <Typography variant="caption">Add balance:</Typography>
            <OneClickAddBalance onClickAdd={handleAddBalance} disabled={loading} />
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}