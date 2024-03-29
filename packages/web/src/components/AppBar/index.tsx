import React from 'react';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useAuth } from '../../providers/AuthProvider';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AppTitle({
  appName,
}: {
  appName: string;
}): JSX.Element {
  return (
    <Box
      sx={{
        flexDirection: 'row',
        display: 'flex',
        flexGrow: 0,
        mr: 3,
        justifyContent: { md: 'start' },
      }}
    >
      <Box sx={{ display: 'flex', mr: 1, mt: 0.5 }}>
        <AccountBalanceIcon />
      </Box>
      <Typography
        variant="h5"
        noWrap
        component="a"
        href=""
        sx={{
          display: 'flex',
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {appName}
      </Typography>
    </Box>
  );
}

export default function AppBar() {
  const navigate = useNavigate();
  const {logout} = useAuth();
  
  const handleClick = () => {
    logout(() => {
      navigate('/login');
    });
  };
  
  return (
    <MuiAppBar sx={{ padding: 1, flexDirection: 'row' }}>
      <AppTitle appName="Deel" />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 0 }}>
        <Button sx={{color: 'white'}} onClick={handleClick}>
          Logout
        </Button>
      </Box>
    </MuiAppBar>
  )
}

