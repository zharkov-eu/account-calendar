const mongodb = require('mongodb');
const config = require('../../config.json');
const { EntityNotFoundError, DataAccessError } = require('../error');

function timeout(ms) { return new Promise(resolve => setTimeout(_ => resolve(_), ms)); }

class MongoRepository {
  /**
   * @param clazz - domain class
   * @param {String} collectionString
   */
  constructor(clazz, collectionString) {
    this.clazz = clazz;
    this.collectionString = collectionString;
    this._semaphore = { open: false, close: false };
  }

  async openDbConnection() {
    if (!this._semaphore.open && !this.collection) {
      const connectAuth = config.mongodb.user ? `${config.mongodb.user}:${config.mongodb.password}@` : '';
      const connectString = `mongodb://${connectAuth}${config.mongodb.host}/${config.mongodb.database}`;
      this.client = await mongodb.MongoClient.connect(connectString);
      this.collection = this.client.db(config.mongodb.database).collection(this.collectionString);
    } else if (!this.collection) {
      await timeout(500);
      await this.openDbConnection();
    }
  }

  async closeDbConnection() {
    if (!this._semaphore.close && this.client) {
      await this.client.close();
      this.client = undefined;
    } else if (this.client) {
      await timeout(500);
      await this.closeDbConnection();
    }
  }

  async getCollection() {
    await this.connection();
    return this.collection;
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
    const entity = await this.collection.findOne(query);
    if (!entity) throw new EntityNotFoundError(query);
    return this.clazz.deserialize(entity);
  }


  async save(entity) {
    await this.connection();
    try {
      await this.collection.insertOne(entity.serialise());
      return entity;
    } catch (error) {
      throw new DataAccessError(error, JSON.stringify(entity));
    }
  }

  async update(query, entity) {
    await this.connection();
    try {
      const updated = await this.collection.findOneAndUpdate(query, { $set: entity.serialise() });
      return this.clazz.deserialize(updated.value);
    } catch (error) {
      throw new DataAccessError(error, JSON.stringify(entity));
    }
  }

  async delete(query) {
    await this.connection();
    await this.collection.deleteOne(query);
  }

  async connection() {
    if (!this.client) {
      await this.openDbConnection();
    }
  }
}

module.exports = MongoRepository;
