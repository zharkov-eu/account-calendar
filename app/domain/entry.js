import Interval from './model/interval';
import EntryDate from './model/entrydate';

export default class Entry {
  static deserialise(entry) {
    return new Entry({
      email: entry.email,
      date: EntryDate.deserialize(entry.date),
      interval: Interval.deserialize(entry.interval),
      status: entry.status,
    });
  }

  /**
   * @param {String} email
   * @param {EntryDate} date
   * @param {Interval} interval
   * @param {StatusEnum} status
   */
  constructor({ email, date, interval, status }) {
    this._email = email;
    this._date = date;
    this._interval = interval;
    this._status = status;
  }

  get email() {
    return this._email;
  }

  get date() {
    return this._date;
  }

  get interval() {
    return this._interval;
  }

  get status() {
    return this._status;
  }

  serialise() {
    return {
      email: this._email,
      date: this._date.serialize(),
      interval: this._interval.serialize(),
      status: this._status,
    };
  }
}
