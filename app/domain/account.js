const { RequiredPropsError } = require('../error');

class Account {
  static deserialize(serialized) {
    return new Account(serialized);
  }

  /**
   * @param {ObjectId} [_id]
   * @param {String} email
   * @param {String} name
   * @param {String} [phone]
   * @param {String} [note] - optional
   * @param {Object} [options]
   */
  constructor({ _id, email, name, phone, note }, options) {
    if (!options || !options.propsUnchecked) {
      if (!email || typeof email !== 'string') { throw new RequiredPropsError('No account email specified', 'email'); }
      if (!name || typeof name !== 'string') { throw new RequiredPropsError('No account name specified', 'name'); }
      if (phone && typeof phone !== 'string') { throw new RequiredPropsError('Account phone type is not a string', 'phone'); }
      if (note && typeof note !== 'string') { throw new RequiredPropsError('Account note type is not a string', 'note'); }
      this._id = _id;
    }
    this._email = email;
    this._name = name;
    this._phone = phone || undefined;
    this._note = note || undefined;
  }

  get id() {
    return this._id;
  }

  get email() {
    return this._email;
  }

  get name() {
    return this._name;
  }

  get phone() {
    return this._phone;
  }

  get note() {
    return this._note;
  }

  serialise() {
    const obj = {};
    for (const key of Object.keys(this)) {
      if (key[0] === '_' && this[key] && typeof this[key] !== 'function') obj[key.slice(1)] = this[key];
    }
    return obj;
  }
}

module.exports = Account;
