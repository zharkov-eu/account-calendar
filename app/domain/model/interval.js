export default class Interval {
  static deserialize(date, serialized) {
    const start = new Date();
    const end = new Date();
    const intervalParts = serialized.split(':');

    start.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    start.setHours(parseInt(intervalParts[0], 10), parseInt(intervalParts[1], 10));
    end.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    end.setHours(parseInt(intervalParts[0], 10), parseInt(intervalParts[1], 10));
    return new Interval(start, end);
  }

  /**
   * @param {Date} start
   * @param {Date} end
   */
  constructor(start, end) {
    this._start = start;
    this._end = end;
  }

  /**
   * @returns {Date}
   */
  get start() {
    return this._start;
  }

  /**
   * @returns {Date}
   */
  get end() {
    return this._end;
  }

  /**
   * @returns {string} - сериализованное представление
   */
  serialize() {
    return `${this.start.getHours()}:${this.start.getMinutes()}-${this.end.getHours()}:${this.end.getMinutes()}`;
  }
}
