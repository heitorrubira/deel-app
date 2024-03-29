import React from 'react';
import Box from '@mui/material/Box';
import { Button, ButtonGroup } from '@mui/material';

const AVAILABLE_BALANCES_TO_ADD = [1, 5, 10, 50, 100, 500];

export type Props = {
  onClickAdd: (n: number) => void;
  disabled: boolean;
};
export default function OneClickAddBalance({ onClickAdd, disabled }: Props): JSX.Element {
  return (
    <Box>
      <ButtonGroup disabled={disabled} variant="contained" size="small" color="success">
        {AVAILABLE_BALANCES_TO_ADD.map((value, idx) => (
          <Button key={`ocab-${idx}`} onClick={() => onClickAdd(value)}>{value.toFixed(2)}</Button>
        ))}
      </ButtonGroup>
    </Box>
  );
}