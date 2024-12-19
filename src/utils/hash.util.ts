import * as bcrypt from 'bcrypt';

class HashUtil {
  private customPasswordSalt = '@3XDTGSASTD&*sdg';

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(
      password + this.customPasswordSalt,
      10,
    );
    return hashedPassword;
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(
      password + this.customPasswordSalt,
      hashedPassword,
    );
  }
}

export const hashUtil = new HashUtil();
