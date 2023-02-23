import { RequestSendEmailController } from "./request-send-email";
import { EmailValidator } from '../../protocols/email-validator';
import { InvalidParamError, MissingParamError, RequestSendEmail, User } from "./request-send-email-protocols";

const makeRequestSendEmailStub = (): RequestSendEmail => {
  class RequestSendEmailStub implements RequestSendEmail {
    request(user: User): string {
      return "Your email are sending.";
    }
  }

  return new RequestSendEmailStub();
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
  sut: RequestSendEmailController
  emailValidatorStub: EmailValidator
  requestSendEmailStub: RequestSendEmail
}

const makeSut = (): SutTypes => {
  const requestSendEmailStub = makeRequestSendEmailStub();
  const emailValidatorStub = makeEmailValidatorStub();
  const sut = new RequestSendEmailController(emailValidatorStub, requestSendEmailStub);

  return {
    sut,
    emailValidatorStub,
    requestSendEmailStub
  }
}

describe("RequestSendEmail Controller", () => {
  it("Should return 400 if no name is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "valid@mail.com"
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
        name: "valid_name"
      }
    }

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  })

  it("Should call isValid with email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = {
      body: {
        name: "valid_name",
        email: "valid@mail.com"
      }
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
        email: "invalid_email"
      }
    }

    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  })

  it("Should call request with correct values", async () => {
    const { sut, requestSendEmailStub } = makeSut();
    const httpRequest = {
      body: {
        name: "valid_name",
        email: "valid@mail.com"
      }
    }

    const requestSpy = jest.spyOn(requestSendEmailStub, "request");
    await sut.handle(httpRequest);

    expect(requestSpy).toBeCalledWith(httpRequest.body);
  })

  it("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "valid_name",
        email: "valid@mail.com"
      }
    }

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toBe("Your email are sending.");
  })
})