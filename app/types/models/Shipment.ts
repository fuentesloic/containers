import { PickupStatus } from '../enums/PickupStatus';

export interface Shipment {
  id: string;
  containerId: string; // FK to Container.id
  locationCoordinates: Coordinates;
  currentStatus: PickupStatus;
  timestamps: ShipmentTimestamps;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ShipmentTimestamps {
  createdAt: Date;
  updatedAt: Date;
}