const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');
const packageJson = require('../package.json');
const Account = require('../app/domain/account');
const Entry = require('../app/domain/entry');
const LoadRepository = require('../app/repository/load');
const mkdir = require('../app/lib/mkdir');

const unloadDir = process.argv[2] || path.join('.', 'dist');

class UnloadTransform extends Transform {
  constructor(transform) {
    super({ objectMode: true });
    this.transform = transform;
  }

  _transform(object, encoding, done) {
    const transformed = this.transform(object);
    this.push(`${JSON.stringify(transformed)},\n`);
    done();
  }
}

(async () => {
  let counter = 2;
  console.log(`${packageJson.name} version ${packageJson.version} unload data started`);

  mkdir(unloadDir);
  const accountRepository = new LoadRepository(Account, 'account');
  const entryRepository = new LoadRepository(Entry, 'entry');

  const accountTransform = new UnloadTransform(account => ({ ...account, ...{ _id: undefined } }));
  const entryTransform = new UnloadTransform(entry => ({ ...entry, ...{ _id: undefined } }));

  const accountWriteStream = fs.createWriteStream(path.join(unloadDir, 'account.json'));
  const entryWriteStream = fs.createWriteStream(path.join(unloadDir, 'entry.json'));

  const accountUnloadStream = await accountRepository.unloadStream();
  const entryUnloadStream = await entryRepository.unloadStream();

  function onFinish() {
    if (--counter === 0) {
      console.log(`${packageJson.name} version ${packageJson.version} unload data ended`);
      process.exit(0);
    }
  }

  accountWriteStream.on('finish', onFinish);
  entryWriteStream.on('finish', onFinish);

  accountUnloadStream.pipe(accountTransform).pipe(accountWriteStream);
  entryUnloadStream.pipe(entryTransform).pipe(entryWriteStream);
})();
