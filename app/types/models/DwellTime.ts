import { DwellTimeStatus } from '../enums/DwellTimeStatus';

export interface DwellTime {
  id: string;
  containerId: string; // FK to Container.id
  startTime: Date;
  endTime: Date;
  status: DwellTimeStatus;
}