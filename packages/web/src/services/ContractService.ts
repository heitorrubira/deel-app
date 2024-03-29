import useAxios from "axios-hooks";
import { Contract } from "../types";
import Config from "../config";

export function useGetContractById(profileId: number, contractId: number) {
  return useAxios<Contract>({
    url: `${Config.apiUrl}/contracts/${contractId}`,
    headers: {
      profile_id: profileId,
    },
  }, { useCache: false });
} 