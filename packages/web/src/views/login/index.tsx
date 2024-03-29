import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Profile } from '../../types';
import { useAuth } from '../../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import ProfileSelector from '../../components/ProfileSelector';

export type Props = {};
const Login = ({}: Props) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, []);

  const handleChange = (profile: Profile | null) => {
    setProfile(profile);
  };

  const handleClick = () => {
    if (profile) {
      login(profile, () => {
        navigate('/');
      });
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'info.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Box mt={2} width={300}>
          <Box mb={2}>
            <ProfileSelector profileType="client" onSelect={handleChange} />
          </Box>
          <Box>
            <Button
              variant="contained"
              fullWidth
              disabled={!profile}
              onClick={handleClick}  
            >
              LogIn
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
export default Login;