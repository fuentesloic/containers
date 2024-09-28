import { TruckerStatus } from '../enums/TruckerStatus';

export interface Trucker {
  id: string;
  name: string;
  status: TruckerStatus;
  dispatcherId: string; // FK to User.id
  createdAt: Date;
  updatedAt: Date;
}