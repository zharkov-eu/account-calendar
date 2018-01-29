const {MongoRepository} = require('./mongo');

class LoadRepository extends MongoRepository {
  async insertBatch(entities) {
    const batch = this.getCollection().initializeOrderedBulkOp();
    entities.forEach((entity) => {
      batch.insert(typeof entity.serialise === 'function' ? entity.serialise() : entity);
    });
    return batch.execute();
  }

  async upsertBatch(query, entities) {
    const batch = this.getCollection().initializeOrderedBulkOp();
    entities.forEach((entity, index) => {
      batch.find(query[index])
        .upsert()
        .updateOne({ $set: typeof entity.serialise === 'function' ? entity.serialise() : entity });
    });
    return batch.execute();
  }

  async unloadStream() {
    return this.getCollection().find({}).stream();
  }
}

exports.LoadRepository = LoadRepository;
