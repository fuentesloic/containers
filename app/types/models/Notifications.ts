import { NotificationStatus } from '../enums/NotificationStatus';

export interface Notification {
  id: string;
  type: string;
  recipientId: string; // FK to User.id
  message: string;
  status: NotificationStatus;
  timestamp: Date;
}