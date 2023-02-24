import { User, UserAccount } from "../models";

export interface CreateAccount {
  create(user: UserAccount): Promise<User>
}