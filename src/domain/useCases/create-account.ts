import { User, UserAccount } from "../models";

export interface CreateAccount {
  create(data: UserAccount): Promise<User>
}