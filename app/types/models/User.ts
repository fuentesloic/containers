export type UserRole = "Logistics Coordinator" | "Trucker Dispatcher" | "Trucker";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
