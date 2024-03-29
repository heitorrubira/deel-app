import { Profile } from "../types";

const LOGIN_CACHE_KEY = '__auth_user_profile__';

export function tryLoadProfile(): Profile | null {
  const str = sessionStorage.getItem(LOGIN_CACHE_KEY);
  if (str !== null && str !== '') {
    return JSON.parse(str);    
  }
  return null;
}

export function cacheProfile(profile: Profile) {
  sessionStorage.setItem(LOGIN_CACHE_KEY, JSON.stringify(profile));
}

export function removeCachedProfile() {
  sessionStorage.removeItem(LOGIN_CACHE_KEY);
}