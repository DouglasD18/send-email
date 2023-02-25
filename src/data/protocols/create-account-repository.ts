import { User } from "../../domain/models";
import { UserAccount } from '../../domain/models/user-account';

export interface CreateAccountRepository {
  create(data: UserAccount): Promise<User>
}