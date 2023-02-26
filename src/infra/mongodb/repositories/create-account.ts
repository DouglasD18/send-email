import { CreateAccountRepository } from "../../../data/protocols";
import { UserAccount, User } from "../../../domain/models";
import { MongoHelper } from '../helpers/mongo';

export class CreateAccountMongoRepository implements CreateAccountRepository {
  async create(data: UserAccount): Promise<User> {
    const accountsCollection = await MongoHelper.getCollection("accounts");
    await accountsCollection.insertOne(data);
    return {
      name: data.name,
      email: data.email
    }
  }
}