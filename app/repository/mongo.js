const { EntityNotFoundError, DataAccessError } = require('../error');

let db;

function setDatabase(database) {
  db = database;
}

class MongoRepository {
  /**
   * @param clazz - domain class
   * @param {String} collectionString
   */
  constructor(clazz, collectionString) {
    this.clazz = clazz;
    this.name = collectionString;
  }

  getCollection() {
    return db.collection(this.name);
  }

  async findAll(query) {
    return (await db.collection(this.name).find(query || {}).toArray())
      .map(entry => (this.clazz.deserialize(entry)));
  }

  async findAllPageable(query, page, size) {
    const totalCount = await db.collection(this.name).count(query);
    const elements = (await db.collection(this.name).find(query).limit(size).skip(page * size).toArray())
      .map(entry => (this.clazz.deserialize(entry)));
    return { content: elements, page, size: elements.length, totalCount };
  }

  async findOne(query) {
    const entity = await db.collection(this.name).findOne(query);
    if (!entity) throw new EntityNotFoundError(query);
    return this.clazz.deserialize(entity);
  }


  async save(entity) {
    try {
      await db.collection(this.name).insertOne(entity.serialise());
      return entity;
    } catch (error) {
      throw new DataAccessError(error, JSON.stringify(entity));
    }
  }

  async update(query, entity) {
    try {
      const updated = await db.collection(this.name).findOneAndUpdate(query, { $set: entity.serialise() });
      return this.clazz.deserialize(updated.value);
    } catch (error) {
      throw new DataAccessError(error, JSON.stringify(entity));
    }
  }

  async delete(query) {
    await db.collection(this.name).deleteOne(query);
  }
}

exports.db = db;
exports.setDatabase = setDatabase;
exports.MongoRepository = MongoRepository;
