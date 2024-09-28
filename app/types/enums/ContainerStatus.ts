export enum ContainerStatus {
  Pending = 'pending_unload',
  Scanned = 'scanned',
  Ready = 'ready_for_pickup',
  Rejected = 'rejected',
}

export const containerStatuses: ContainerStatus[] = [
  ContainerStatus.Pending,
  ContainerStatus.Scanned,
  ContainerStatus.Ready,
  ContainerStatus.Rejected,
];