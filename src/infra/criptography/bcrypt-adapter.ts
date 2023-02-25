import { Encrypter } from "../../data/protocols";
import bcrypt from "bcrypt";

export class BcryptAdapter implements Encrypter {
  async encrypt(password: string): Promise<string> {
    const encrypted = await bcrypt.hash(password, 12);

    return encrypted;
  }
}