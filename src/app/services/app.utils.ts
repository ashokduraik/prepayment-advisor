
export class AppUtils {

  static getUid() {
    return AppUtils.hex(Date.now() / 1000) +
      ' '.repeat(16).replace(/./g, () => AppUtils.hex(Math.random() * 16))
  }

  static hex(value) {
    return Math.floor(value).toString(16)
  }

  static errorLog(err) {
    console.error(err);
  }
}