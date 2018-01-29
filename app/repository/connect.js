const mongodb = require('mongodb');
const config = require('../../config.json');

let client;

exports.openDbConnection = async () => {
  const connectAuth = config.mongodb.user
    ? `${config.mongodb.user}:${config.mongodb.password}@`
    : '';
  const connectString = `mongodb://${connectAuth}${config.mongodb.host}/${config.mongodb.database}`;
  client = await mongodb.MongoClient.connect(connectString);
  return client.db(config.mongodb.database);
};

exports.closeDbCollection = async () => {
  await client.close();
};
