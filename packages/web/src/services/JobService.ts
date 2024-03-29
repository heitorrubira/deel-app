import useAxios from "axios-hooks";
import { Job } from "../types";
import Config from "../config";

export function useGetJobsUnpaid(profileId: number) {
  return useAxios<Job[]>({
    url: `${Config.apiUrl}/jobs/unpaid`,
    headers: {
      profile_id: profileId,
    },
  });
} 

export function usePayJob(profileId: number, jobId: number) {
  return useAxios<Job>({
    url: `${Config.apiUrl}/jobs/${jobId}/pay`,
    method: 'POST',
    headers: {
      profile_id: profileId,
    },
  }, {
    manual: true
  }); 
}