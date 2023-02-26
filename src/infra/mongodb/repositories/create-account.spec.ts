import { User, UserAccount } from "../../../domain/models"
import { MongoHelper } from "../helpers/mongo"
import { CreateAccountMongoRepository } from "./create-account"

const makeUser = (): User => ({
  name: "valid_name",
  email: "valid@mail.com"
})

const makeUserAccount = (): UserAccount => ({
  name: "valid_name",
  email: "valid@mail.com",
  password: "valid_password"
})

describe("CreateAccountMongoRepository", () => {
  beforeAll(async () => {
    await MongoHelper.connect();
  })

  afterAll(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
    await MongoHelper.disconnect();
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  it("Should return an user on success", async () => {
    const sut = new CreateAccountMongoRepository();

    const user = await sut.create(makeUserAccount());

    expect(user).toBeTruthy();
    expect(user.email).toBeTruthy();
    expect(user.name).toBeTruthy();
  })

  it("Should return an beer with correct properties", async () => {
    const sut = new CreateAccountMongoRepository();
    const fakeUser = makeUser();

    const user = await sut.create(makeUserAccount());

    expect(user.name).toEqual(fakeUser.name);
    expect(user.email).toEqual(fakeUser.email);
  })
})