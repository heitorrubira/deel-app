import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Profile } from '../types';
import { cacheProfile, removeCachedProfile, tryLoadProfile } from '../services';

type AuthContextType = {
  profile: Profile | null;
  isAuthenticated: boolean;
  updateProfile: (profile: Profile, cb?: VoidFunction) => void;
  login: (profile: Profile, cb?: VoidFunction) => void;
  logout: (cb?: VoidFunction) => void;
};

const Context = createContext<AuthContextType>(null!);

export const useAuth = (): AuthContextType => useContext(Context);

export type Props = PropsWithChildren<{}>;
export default function AuthProvider({ children }: Props): JSX.Element {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setProfile(tryLoadProfile());
  }, []);

  const login = (profile: Profile, cb?: VoidFunction): void => {
    cacheProfile(profile);
    setProfile(profile);
    cb?.();
  };

  const logout = (cb?: VoidFunction): void => {
    removeCachedProfile();
    setProfile(null);
    cb?.();
  };

  const updateProfile = (newProfile: Profile, cb?: VoidFunction) => {
    cacheProfile(newProfile);
    setProfile(newProfile);
    cb?.();
  };

  return (
    <Context.Provider value={{
      login,
      logout,
      updateProfile,
      isAuthenticated: !!profile,
      profile: profile,
    }}>
      {children}
    </Context.Provider>
  )
}