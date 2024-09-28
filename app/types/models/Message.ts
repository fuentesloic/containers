export interface Message {
    id: string;
    senderId: string; // FK to User.id
    receiverId: string; // FK to User.id
    content: string;
    timestamp: Date;
  }