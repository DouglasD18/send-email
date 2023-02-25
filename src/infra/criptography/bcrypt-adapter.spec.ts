import { BcryptAdapter } from "./bcrypt-adapter";
import bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
  async hash(_value: any): Promise<string> {
    return new Promise(resolve => resolve("encrypted_password"))
  }
}))

describe("Bcrypt Adapter", () => {
  it("Should call Bcrypt with correct value", async () => {
    const sut = new BcryptAdapter();

    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt("valid_password");

    expect(hashSpy).toHaveBeenCalledWith("valid_password", 12);
  })

  it("Should return a hash on success", async () => {
    const sut = new BcryptAdapter();

    const hash = await sut.encrypt("valid_password");

    expect(hash).toBe("encrypted_password");
  })
})