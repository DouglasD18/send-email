import { Controller, CreateAccount, EmailValidator, HttpRequest, HttpResponse, InvalidParamError, MissingParamError, badRequest, created, serverError } from "./create-account-protocols";

export class CreateAccountController implements Controller {
  constructor(
    private emailValidator: EmailValidator,
    private createAccount: CreateAccount
  ) {}

  validateBody(body: any): boolean | string {
    const params = ["name", "email", "password"];
    for (const param of params) {
      if (!body[param]) {
        return param;
      }
    }
    return true;
  }
  
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest;

      const bodeValidation = this.validateBody(body)
      if (typeof bodeValidation === "string") {
        return badRequest(new MissingParamError(bodeValidation));
      } 

      const { name, email, password } = body;

      const verify = this.emailValidator.isValid(email);
      if (!verify) {
        return badRequest(new InvalidParamError("email"));
      }

      const account = await this.createAccount.create({ name, email, password });

      return created(account);
    } catch (error) {
      return serverError();
    }
  }
}