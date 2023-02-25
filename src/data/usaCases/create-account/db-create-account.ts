import { UserAccount, User } from "../../../domain/models";
import { CreateAccount } from "../../../domain/useCases/create-account";
import { CreateAccountRepository, Encrypter, QueueInterface } from "../../protocols";

export class DbCreateAccount implements CreateAccount {
  constructor(
    private encrypter: Encrypter,
    private repository: CreateAccountRepository,
    private queue: QueueInterface
  ) {}

  async create(data: UserAccount): Promise<User> {
    const { name, email, password } = data;

    const encrypted = await this.encrypter.encrypt(password);

    const user = await this.repository.create({ name, email, password: encrypted });

    this.queue.add("SendEmail", { user });

    return user;
  }
}