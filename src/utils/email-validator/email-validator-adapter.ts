import { EmailValidator } from '../../presentation/protocols/email-validator';

export class EmailValidatorAdapter implements EmailValidator {
  private emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;

  isValid(email: string): boolean {
    return this.emailRegex.test(email);
  }
}