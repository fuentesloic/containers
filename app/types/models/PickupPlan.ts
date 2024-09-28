import { PickupPlanStatus } from '../enums/PickupPlanStatus';

export interface PickupPlan {
  id: string;
  logisticsCoordinatorId: string; // FK to User.id
  truckerDispatcherId: string; // FK to User.id
  status: PickupPlanStatus;
  createdAt: Date;
  updatedAt: Date;
}