import React from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { Profile, ProfileType } from '../../types';
import { useGetProfiles } from '../../services';

export type OwnProps = {
  label: string;
  data: Profile[];
  disabled?: boolean;
  onSelect: (profile: Profile | null) => void;
}

export function ProfileSelector({ label, data, disabled, onSelect }: OwnProps): JSX.Element {
  return (
    <Box sx={{ display: 'flex', alignContent: 'center' }}>
      <Box margin="auto">
        <Autocomplete
          disabled={disabled}
          disablePortal
          onChange={(_event, profile) => {
            onSelect(profile ?? null);
          }}
          onReset={() => {
            onSelect(null);
          }}
          getOptionLabel={(item) => item ? `${item.firstName} ${item.lastName}` : ''}
          options={(data || [])}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label={label} />}
        />
      </Box>
    </Box>
  )
}

export type WithDataProps = Omit<OwnProps, 'label' | 'data' | 'disabled'> & {
  profileType: ProfileType;
}

export default function ProfileSelectorWithData({ profileType, onSelect }: WithDataProps): JSX.Element {
  const [{ error, data, loading }] = useGetProfiles(profileType);

  if (error) {
    console.error('Fetch profile error!', { error });
    alert('Error on fetch profiles!');
  }

  return (
    <ProfileSelector
      label={profileType === 'client' ? 'Client' : 'Contractor'}
      onSelect={onSelect}
      data={data || []}
      disabled={loading}
    />
  );
}