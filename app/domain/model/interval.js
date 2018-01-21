/**
 * @param number
 * @returns {string}
 */
function zeroBased(number) {
  return number.toString().length === 2 ? number.toString() : `0${number}`;
}


class Interval {
  static deserialize(date, serialized) {
    const start = new Date();
    const end = new Date();
    const intervalPoint = serialized.split('-').map(point => point.split(':'));

    start.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    start.setHours(parseInt(intervalPoint[0][0], 10), parseInt(intervalPoint[0][1], 10));
    end.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    end.setHours(parseInt(intervalPoint[1][0], 10), parseInt(intervalPoint[1][1], 10));
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
    const parts = [
      this.start.getHours(), this.start.getMinutes(),
      this.end.getHours(), this.end.getMinutes(),
    ].map(_ => zeroBased(_));
    return `${parts[0]}:${parts[1]}-${parts[2]}:${parts[3]}`;
  }
}

module.exports = Interval;
