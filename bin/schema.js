const mongodb = require('mongodb');
const config = require('../config.json');
const packageJson = require('../package.json');

(async () => {
  console.log(`${packageJson.name} version ${packageJson.version} schema creation started`);

  const connectAuth = config.mongodb.user ? `${config.mongodb.user}:${config.mongodb.password}@` : '';
  const connectString = `mongodb://${connectAuth}${config.mongodb.host}/${config.mongodb.database}`;
  const client = await mongodb.MongoClient.connect(connectString);
  const db = client.db(config.mongodb.database);

  const promises = [];

  promises.push(db.createIndex('account', { email: 1 }, { unique: true }));
  promises.push(db.createIndex('entry', { email: 1, date: 1 }, { unique: true }));

  await Promise.all(promises);

  console.log(`${packageJson.name} version ${packageJson.version} schema creation successfully ended`);
  process.exit(0);
})();
