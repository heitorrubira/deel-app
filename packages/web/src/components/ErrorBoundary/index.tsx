import React from 'react';
import { useRouteError } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ErrorBoundary(): JSX.Element {
  const error: any = useRouteError();

  console.error('something went wrong', { error });
  return (
    <Box>
      <Typography variant="h4" color="error.main">
        Sorry!
      </Typography>
      <Typography variant="body1" color="default">
        An unknow error happened.
      </Typography>
    </Box>
  );
}