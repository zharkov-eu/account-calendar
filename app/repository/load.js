const MongoRepository = require('./mongodb');

class LoadRepository extends MongoRepository {
  async insertBatch(entities) {
    await this.connection();
    const batch = this.collection.initializeOrderedBulkOp();
    entities.forEach((entity) => {
      batch.insert(typeof entity.serialise === 'function' ? entity.serialise() : entity);
    });
    return batch.execute();
  }

  async upsertBatch(query, entities) {
    await this.connection();
    const batch = this.collection.initializeOrderedBulkOp();
    entities.forEach((entity, index) => {
      batch.find(query[index])
        .upsert()
        .updateOne({ $set: typeof entity.serialise === 'function' ? entity.serialise() : entity });
    });
    return batch.execute();
  }

  async unloadStream() {
    await this.connection();
    return this.collection.find({}).stream();
  }
}

module.exports = LoadRepository;
