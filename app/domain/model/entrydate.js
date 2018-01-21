class EntryDate {
  static deserialize(serialized) {
    return new EntryDate(new Date(serialized));
  }

  /**
   * @param {Date} date
   */
  constructor(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) throw new Error("Date can't be parsed");
    this._date = date;
  }

  /**
   * @returns {Date}
   */
  get date() {
    return this._date;
  }

  /**
   * @returns {number} - сериализованное представление
   */
  serialize() {
    return this.date.getTime();
  }
}

module.exports = EntryDate;
