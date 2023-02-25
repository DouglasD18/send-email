import { EmailValidatorAdapter } from "./email-validator-adapter";

describe("EmailValidator Adapter", () => {
  it("Should return false if email do not have @", () => {
    const sut = new EmailValidatorAdapter();

    const isValid = sut.isValid("invalid_email_mail.com");

    expect(isValid).toBe(false);
  })

  it("Should return false if email do not have . after @", () => {
    const sut = new EmailValidatorAdapter();

    const isValid = sut.isValid("invalid.email@mailcom");

    expect(isValid).toBe(false);
  })

  it("Should return true with email is valid", () => {
    const sut = new EmailValidatorAdapter();

    const isValid = sut.isValid("invalid_email@mail.com");

    expect(isValid).toBe(true);
  })
});