import { PriorityLevel } from '../enums/PriorityLevel';
import { ContainerStatus } from '../enums/ContainerStatus';
import { PickupStatus } from '../enums/PickupStatus';

export interface ContainerFilters {
  priorityLevel?: PriorityLevel | PriorityLevel[];
  containerStatus?: ContainerStatus | ContainerStatus[];
  pickupStatus?: PickupStatus | PickupStatus[]
  aiPriorityScoreMin?: number;
  aiPriorityScoreMax?: number;
}

export interface Container {
  id: string;
  contentsDescription: string;
  hsCode: string;
  weightKg: number;
  quantity: number;
  packageType: string;
  shipper: string;
  consignee: string;
  priorityLevel: PriorityLevel;
  containerStatus: ContainerStatus | null;
  pickupStatus: PickupStatus | null;
  carrierId: string; // FK to Trucker.id
  destination: string;
  aiPriorityScore: number;
  pickupPlanId: string | null; // FK to PickupPlan.id
  createdAt: Date;
  updatedAt: Date;
}