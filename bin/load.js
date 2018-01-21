const fs = require('fs');
const path = require('path');
const { Transform, Writable } = require('stream');
const JSONStream = require('JSONStream');
const packageJson = require('../package.json');
const Account = require('../app/domain/account');
const Entry = require('../app/domain/entry');
const EntryDate = require('../app/domain/model/entrydate');
const Interval = require('../app/domain/model/interval');
const Status = require('../app/domain/model/status');
const LoadRepository = require('../app/repository/load');

const loadFile = process.argv[2] || path.join('.', 'dist', 'workdays-testdata-04082017.json');

class LoadTransform extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(object, encoding, done) {
    // Account generation
    const account = new Account({ email: object.email, name: object.name });

    // Entry generation
    const _dateStart = new Date(`${object.date.split('.').reverse().join('-')}T00:00:00`);
    const _dateFinish = new Date(_dateStart.getTime() + (23 * 60 * 60 * 1000));
    const date = new EntryDate(_dateStart);
    const interval = new Interval(_dateStart, _dateFinish);
    const status = Status[object.status];
    const entry = new Entry({ email: object.email, date, interval, status });

    this.push({ account, entry });
    done();
  }
}

class MongoInsert extends Writable {
  constructor(accountRepository, entryRepository, batchSize) {
    super({ objectMode: true });
    this.accountRepository = accountRepository;
    this.entryRepository = entryRepository;
    this.batchSize = batchSize;
    this.accounts = [];
    this.entries = [];

    this.onFinish = () => {
      const promises = [];
      promises.push(this.entryRepository
        .insertBatch(this.entries));
      promises.push(this.accountRepository
        .upsertBatch(this.accounts.map(account => ({ email: account.email })), this.accounts));

      Promise.all(promises).then(() => {
        console.log(`${packageJson.name} version ${packageJson.version} load data successfully ended`);
        process.exit(0);
      });
    };

    this.on('finish', this.onFinish);
  }

  _write(object, encoding, cb) {
    if (this.accounts.length < this.batchSize) {
      this.accounts.push(object.account);
      this.entries.push(object.entry);
      cb(null, object);
    } else {
      const promises = [];
      promises.push(this.entryRepository
        .insertBatch(this.entries));
      promises.push(this.accountRepository
        .upsertBatch(this.accounts.map(account => ({ email: account.email })), this.accounts));

      this.entries = [];
      this.accounts = [];

      Promise.all(promises).then(() => cb());
    }
  }
}

(async () => {
  console.log(`${packageJson.name} version ${packageJson.version} load data started`);

  const accountRepository = new LoadRepository(Account, 'account');
  const entryRepository = new LoadRepository(Entry, 'entry');

  const readStream = fs.createReadStream(loadFile);
  const loadTransform = new LoadTransform();
  const mongoInsert = new MongoInsert(accountRepository, entryRepository, 1000);

  readStream.pipe(JSONStream.parse('*')).pipe(loadTransform).pipe(mongoInsert);
})();
