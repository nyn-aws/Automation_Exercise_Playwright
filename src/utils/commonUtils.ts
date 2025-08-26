export class CommonUtils {
  static generateRandomString(length: number): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static generateRandomEmail(): string {
    const randomString = CommonUtils.generateRandomString(10);
    return `${randomString}@example.com`;
  }

  static generateRandomPassword(): string {
    const randomString = CommonUtils.generateRandomString(10);
    return `${randomString}!`;
  }
}
