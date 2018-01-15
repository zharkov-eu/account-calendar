import { RequiredPropsError } from '../error';

export default class Account {
  static desirealize(serialized) {
    return new Account(serialized);
  }

  /**
   * @param {String} email
   * @param {String} name
   * @param {String} phone
   * @param {String} note - optional
   */
  constructor({ email, name, phone, note }) {
    if (!email || typeof email !== 'string') { throw new RequiredPropsError('No account email specified', 'email'); }
    if (!name || typeof name !== 'string') { throw new RequiredPropsError('No account name specified', 'name'); }
    if (!phone || typeof phone !== 'string') { throw new RequiredPropsError('No account phone specified', 'phone'); }
    if (note && typeof note !== 'string') { throw new RequiredPropsError('Account note type is not a string', 'note'); }
    this._email = email;
    this._name = name;
    this._phone = phone;
    this._note = note;
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
    return {
      email: this._email,
      name: this._name,
      phone: this._phone,
      note: this._note,
    };
  }
}
