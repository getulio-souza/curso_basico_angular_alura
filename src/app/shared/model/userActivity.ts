import { User } from "./user";

export interface UserActivity {
  id?: string,
  context: string,
  activity: string,
  user?: User,
  createdAt?: Date
}