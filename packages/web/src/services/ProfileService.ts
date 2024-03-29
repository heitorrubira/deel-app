import useAxios from "axios-hooks";
import { Profile, ProfileType } from "../types";
import Config from "../config";

export function useGetProfiles(profileType: ProfileType = 'client') {
  return useAxios<Profile[]>({
    url: `${Config.apiUrl}/profiles`,
    params: { profileType }
  });
} 