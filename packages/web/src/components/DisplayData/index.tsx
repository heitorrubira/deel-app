import React from 'react';
import { Grid, List, ListItem, ListItemText, Typography } from '@mui/material';

export type Props = {
  title: string;
  data: { [key: string]: string };
}
export default function DisplayData({ title, data }: Props): JSX.Element {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          {title}
        </Typography>
        <List dense>
          {Object.keys(data).map((key) => (
            <ListItem key={`li-${key}`}>
              <ListItemText
                key={`li-${key}`}
                primary={`${key}:`}
                secondary={data[key]}
              />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}