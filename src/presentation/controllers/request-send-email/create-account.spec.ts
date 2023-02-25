import { CreateAccountController } from "./create-account";
import { EmailValidator } from '../../protocols/email-validator';
import { InvalidParamError, MissingParamError, CreateAccount, ServerError } from "./create-account-protocols";
import { User, UserAccount } from "../../../domain/models";

const fakeUser: UserAccount = {
  name: "valid_name",
  email: "valid@mail.com",
  password: "valid_password"
}

const makeCreateAccountStub = (): CreateAccount => {
  class CreateAccountStub implements CreateAccount {
    create(user: UserAccount): Promise<User> {
      return new Promise(resolve => resolve(fakeUser));
    }
  }

  return new CreateAccountStub();
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

interface SutTypes {
  sut: CreateAccountController
  emailValidatorStub: EmailValidator
  createAccountStub: CreateAccount
}

const makeSut = (): SutTypes => {
  const createAccountStub = makeCreateAccountStub();
  const emailValidatorStub = makeEmailValidatorStub();
  const sut = new CreateAccountController(emailValidatorStub, createAccountStub);

  return {
    sut,
    emailValidatorStub,
    createAccountStub
  }
}

describe("CreateAccount Controller", () => {
  it("Should return 400 if no name is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "valid@mail.com",
        password: "valid_password"
      }
    }

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  })

  it("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "valid_name",
        password: "valid_password"
      }
    }

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  })

  it("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "valid_name",
        email: "valid@mail.com"
      }
    }

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  })

  it("Should call isValid with email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = {
      body: fakeUser
    }

    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    await sut.handle(httpRequest);

    expect(isValidSpy).toBeCalledWith(httpRequest.body.email);
  })

  it("Should return 400 if no email is invalid", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = {
      body: {
        name: "valid_name",
        email: "invalid_email",
        password: "valid_password"
      }
    }

    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  })

  it("Should call request with correct values", async () => {
    const { sut, createAccountStub } = makeSut();
    const httpRequest = {
      body: fakeUser
    }

    const requestSpy = jest.spyOn(createAccountStub, "create");
    await sut.handle(httpRequest);

    expect(requestSpy).toBeCalledWith(httpRequest.body);
  })

  it("Should return 500 if CreateAccount throws", async () => {
    const { sut, createAccountStub } = makeSut();
    const httpRequest = {
      body: fakeUser
    }

    jest.spyOn(createAccountStub, "create").mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  })

  it("Should return 201 on success", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: fakeUser
    }

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(201);
    expect(httpResponse.body).toBe(fakeUser);
  })
})