const fs = require('fs');
const path = require('path');
const {Transform} = require('stream');
const packageJson = require('../package.json');
const {setDatabase} = require('../app/repository/mongo');
const {openDbConnection, closeDbCollection} = require('../app/repository/connect');
const Account = require('../app/domain/account');
const Entry = require('../app/domain/entry');
const {LoadRepository} = require('../app/repository/load');
const mkdir = require('../app/lib/mkdir');

const unloadDir = process.argv[2] || path.join('.', 'dist');

class UnloadTransform extends Transform {
  constructor(transform) {
    super({objectMode: true});
    this.transform = transform;
  }

  _transform(object, encoding, done) {
    const transformed = this.transform(object);
    this.push(`${JSON.stringify(transformed)},\n`);
    done();
  }
}

class Unload {
  constructor() {
    this.endCounter = 0;
    this.repository = [];
    this.transform = [];
    this.writeStream = [];
  }

  register(clazz, collection, filename) {
    this.repository.push(new LoadRepository(clazz, collection));
    this.transform.push(new UnloadTransform(entity => ({...entity, ...{_id: undefined}})));
    this.writeStream.push(fs.createWriteStream(path.join(unloadDir, filename)));
    this.endCounter++;
  }

  async unload() {
    this.repository.forEach(async (repository, index) => {
      const unloadStream = await repository.unloadStream();
      const transformStream = this.transform[index];
      const writeStream = this.writeStream[index];

      unloadStream.on('error', err => console.error(err.message));
      transformStream.on('error', err => console.error(err.message));
      writeStream.on('error', err => console.error(err.message));

      unloadStream.pipe(transformStream).pipe(writeStream);
      writeStream.on('finish', this.end.bind(this));
    });
  }

  async end() {
    if (--this.endCounter === 0) {
      await closeDbCollection();
      console.log(`${packageJson.name} version ${packageJson.version} load log ended`);
      process.exit(0);
    }
  }
}

(async () => {
  // Инициализировать подключение к БД
  setDatabase(await openDbConnection());

  console.log(`${packageJson.name} version ${packageJson.version} unload data started`);
  mkdir(unloadDir);

  const unload = new Unload();

  unload.register(Account, 'account', 'account.json');
  unload.register(Entry, 'entry', 'entry.json');

  await unload.unload();
})();
