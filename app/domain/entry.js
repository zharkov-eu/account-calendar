const Interval = require('./model/interval');
const EntryDate = require('./model/entrydate');
const { StatusReverseEnum } = require('./model/status');
const { RequiredPropsError } = require('../error');

class Entry {
  static deserialize(entry) {
    return new Entry({
      email: entry.email,
      date: EntryDate.deserialize(entry.date),
      interval: Interval.deserialize(EntryDate.deserialize(entry.date)._date, entry.interval),
      status: entry.status,
    });
  }

  /**
   * @param {ObjectID} [_id]
   * @param {String} email
   * @param {EntryDate} date
   * @param {Interval} interval
   * @param {StatusEnum} status
   */
  constructor({ _id, email, date, interval, status }) {
    if (!email || typeof email !== 'string') { throw new RequiredPropsError('No account email specified', 'email'); }
    this._id = _id;
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

  serialise(options) {
    if (options && options.view) {
      return {
        _id: this._id,
        email: this._email,
        date: this._date._date.toISOString(),
        interval: {
          start: this._interval.start.toISOString(),
          end: this._interval.end.toISOString(),
        },
        status: StatusReverseEnum[this._status],
      };
    }
    return {
      _id: this._id,
      email: this._email,
      date: this._date.serialize(),
      interval: this._interval.serialize(),
      status: this._status,
    };
  }
}

module.exports = Entry;
