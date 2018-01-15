import * as mongodb from 'mongodb';
import config from '../../config.json';
import { DataAccessError } from '../error';

export default class MongoRepository {
  /**
   * @param clazz - domain class
   * @param {String} collectionString
   */
  constructor(clazz, collectionString) {
    this.clazz = clazz;
    this.collectionString = collectionString;
  }

  async openDbConnection() {
    if (!this.collection) {
      const connectAuth = config.dbUser ? `${config.dbUser}:${config.dbPassword}@` : '';
      const connectString = `mongodb://${connectAuth}${config.dbUrl}`;
      this.dbConnection = await mongodb.MongoClient.connect(connectString);
      this.collection = this.dbConnection.collection(this.collectionString);
    }
  }

  async closeDbCollection() {
    if (this.dbConnection) {
      await this.dbConnection.close();
      this.dbConnection = null;
    }
  }

  async findAll(query) {
    await this.connection();
    return (await this.collection.find(query || {}).toArray())
      .map(entry => (this.clazz.deserialize(entry)));
  }

  async findAllPageable(query, page, size) {
    await this.connection();
    const totalCount = await this.collection.count(query);
    const elements = (await this.collection.find(query).limit(size).skip(page * size).toArray())
      .map(entry => (this.clazz.deserialize(entry)));
    return { content: elements, page, size: elements.length, totalCount };
  }

  async findOne(query) {
    await this.connection();
    return this.clazz.deserialise(await this.collection.findOne(query));
  }


  async save(entity) {
    await this.connection();
    try {
      await this.collection.insertOne(entity);
      return this.clazz.deserialise(entity);
    } catch (error) {
      throw new DataAccessError(error, JSON.stringify(entity));
    }
  }

  async update(query, entity) {
    await this.connection();
    try {
      await this.collection.updateOne(query, entity);
      return this.clazz.deserialise(entity);
    } catch (error) {
      throw new DataAccessError(error, JSON.stringify(entity));
    }
  }

  async delete(query) {
    await this.connection();
    await this.collection.deleteOne(query);
  }

  async connection() {
    if (!this.dbConnection) {
      await this.openDbConnection();
    }
  }
}
