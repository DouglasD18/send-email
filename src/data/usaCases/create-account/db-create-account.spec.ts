import { User, UserAccount } from "../../../domain/models"
import { CreateAccountRepository, Encrypter, QueueInterface } from "../../protocols"
import { DbCreateAccount } from "./db-create-account"

const makeUser = (): User => ({
  name: "valid_name",
  email: "valid@mail.com"
})

const makeUserAccount = (): UserAccount => ({
  name: "valid_name",
  email: "valid@mail.com",
  password: "valid_password"
})

const makeQueue = (): QueueInterface => {
  class QueueStub implements QueueInterface {
    add(jobName: string, data: { user: User }): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }

  return new QueueStub();
}

const makeCreateAccountRepository = (): CreateAccountRepository => {
  class CreateAccountRepositoryStub implements CreateAccountRepository {
    create(data: UserAccount): Promise<User> {
      return new Promise(resolve => resolve(makeUser()))
    }
  }
  
  return new CreateAccountRepositoryStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(password: string): Promise<string> {
      return new Promise(resolve => resolve("encrypted_password"))
    }
  }
  
  return new EncrypterStub()
}

interface SutTypes {
  sut: DbCreateAccount
  encrypterStub: Encrypter
  createAccountRepositoryStub: CreateAccountRepository
  queueStub: QueueInterface
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const createAccountRepositoryStub = makeCreateAccountRepository();
  const queueStub = makeQueue();
  const sut = new DbCreateAccount(encrypterStub, createAccountRepositoryStub, queueStub);

  return {
    sut,
    encrypterStub,
    createAccountRepositoryStub,
    queueStub
  }
}

describe("DbCreateAccount Usecase", () => {
  it("Should call Encrypter with correct password", async () => {
    const { sut, encrypterStub } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    sut.create(makeUserAccount());

    expect(encryptSpy).toHaveBeenCalledWith("valid_password")
  })

  it("Should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();

    jest.spyOn(encrypterStub, "encrypt").mockReturnValueOnce(new Promise((_r, reject) => reject(new Error())));
    const promise = sut.create(makeUserAccount());

    expect(promise).rejects.toThrow();
  })

  it("Should call CreateAccountRepository with correct values", async () => {
    const { sut, createAccountRepositoryStub } = makeSut();

    const createSpy = jest.spyOn(createAccountRepositoryStub, "create");
    await sut.create(makeUserAccount());

    expect(createSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid@mail.com",
      password: "encrypted_password"
    })
  })

  it("Should throw if CreateAccountRepository throws", async () => {
    const { sut, createAccountRepositoryStub } = makeSut();

    jest.spyOn(createAccountRepositoryStub, "create").mockReturnValueOnce(new Promise((_r, reject) => reject(new Error())));
    const promise = sut.create(makeUserAccount());

    expect(promise).rejects.toThrow();
  })

  it("Should call Queue if correct user data", async () => {
    const { sut, queueStub } = makeSut();

    const addSpy = jest.spyOn(queueStub, "add");
    await sut.create(makeUserAccount());

    expect(addSpy).toHaveBeenCalledWith("SendEmail", { user: makeUser() });
  })

  it("Should return an account on sucess", async () => {
    const { sut } = makeSut();

    const user = await sut.create(makeUserAccount());

    expect(user).toEqual({
      name: "valid_name",
      email: "valid@mail.com"
    })
  })
})