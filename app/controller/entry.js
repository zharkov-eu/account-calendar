const { ObjectID } = require('mongodb');
const Entry = require('../domain/entry');
const errorController = require('./error');
const MongoRepository = require('../repository/mongodb');

const entryRepository = new MongoRepository(Entry, 'entry');

const EntryController = {

  getAll: async (req, res) => {
    try {
      return res.json({ });
    } catch (error) {
      return errorController(error, req, res);
    }
  },

  get: async (req, res) => {
    try {
      const entry = entryRepository.findOne({ _id: new ObjectID(req.params.id) });
      return res.json(entry.serialise());
    } catch (error) {
      return errorController(error, req, res);
    }
  },

  post: async (req, res) => {
    try {
      return res.status(201).json({ });
    } catch (error) {
      return errorController(error, req, res);
    }
  },

  patch: async (req, res) => {
    try {
      return res.json({ });
    } catch (error) {
      return errorController(error, req, res);
    }
  },

  delete: async (req, res) => {
    try {
      return res.status(204).send();
    } catch (error) {
      return errorController(error, req, res);
    }
  },
};

module.exports = EntryController;
