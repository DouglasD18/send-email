import { User } from "../models/user";
import { UserAccount } from "../models/user-account";

export interface CreateAccount {
  request(user: UserAccount): Promise<User>
}