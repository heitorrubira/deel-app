export type ProfileType = 'client' | 'contractor';
export type ContractStatus = 'new' | 'in_progress' | 'terminated';

export type Profile = {
  id: number;
  firstName: string;
  lastName: string;
  profession: string;
  balance: number;
  type: ProfileType;
  createdAt: string;
  updatedAt: string;
};

export type Contract = {
  id: number;
  terms: string;
  status: ContractStatus;
  ClientId: number;
  ContractorId: number;
  createdAt: string;
  updatedAt: string;
  Client: Profile;
  Contractor: Profile;
};

export type Job = {
  id: number;
  description: string;
  price: number;
  paid?: boolean;
  paymentDate?: string;
  ContractId: number;
  createdAt: string;
  updatedAt: string;
};