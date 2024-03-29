import useAxios from "axios-hooks";
import { Profile } from "../types";
import Config from "../config";

export function useAddBalance(userId: number) {
  return useAxios<Profile, { amount: number }>({
    method: 'POST',
    url: `${Config.apiUrl}/balances/deposit/${userId}`,
  }, {
    manual: true
  });
} 