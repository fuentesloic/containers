export enum PickupStatus {
  Unassigned = 'unassigned',
  Assigned = 'assigned',
  Confirmed = 'confirmed',
  PickedUp = 'picked_up',
  Delivered = 'delivered',
  Canceled = 'canceled',
}

export const pickupStatuses: PickupStatus[] = [
  PickupStatus.Assigned,
  PickupStatus.Canceled,
  PickupStatus.Confirmed,
  PickupStatus.Delivered,
  PickupStatus.PickedUp,
  PickupStatus.Unassigned,
];