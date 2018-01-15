export default class EntryDate {
  static deserialize(serialized) {
    const dateParts = serialized.split('-');
    const date = new Date();

    date.setFullYear(dateParts[0], dateParts[1] - 1, dateParts[2]);
    date.setHours(0, 0, 0);
    return new EntryDate(date);
  }

  /**
   * @param {Date} date
   */
  constructor(date) {
    this._date = date;
  }

  /**
   * @returns {Date}
   */
  get date() {
    return this._date;
  }

  /**
   * @returns {string} - сериализованное представление
   */
  serialize() {
    return `${this._date.getFullYear()}-${this._date.getMonth() + 1}-${this._date.getDate()}`;
  }
}
