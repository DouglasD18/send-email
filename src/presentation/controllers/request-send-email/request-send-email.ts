import { Controller, EmailValidator, HttpRequest, HttpResponse, InvalidParamError, MissingParamError, RequestSendEmail, badRequest, ok } from "./request-send-email-protocols";

export class RequestSendEmailController implements Controller {
  constructor(
    private emailValidator: EmailValidator,
    private requestSendEmail: RequestSendEmail
  ) {}
  
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest;

    if (!body.name) {
      return badRequest(new MissingParamError("name"));
    } else if (!body.email) {
      return badRequest(new MissingParamError("email"));
    }

    const { name, email } = body;

    const verify = this.emailValidator.isValid(email);
    if (!verify) {
      return badRequest(new InvalidParamError("email"));
    }

    const response = this.requestSendEmail.request({ name, email });

    return new Promise(resolve => resolve(ok(response)));
  }
}