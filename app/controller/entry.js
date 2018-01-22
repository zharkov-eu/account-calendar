const { ObjectID } = require('mongodb');
const Entry = require('../domain/entry');
const errorController = require('./error');
const MongoRepository = require('../repository/mongodb');

const entryRepository = new MongoRepository(Entry, 'entry');

const EntryController = {

  getAll: async (req, res) => {
    try {
      const email = req.body.email;
      const page = parseInt(req.query.page, 10);
      const size = parseInt(req.query.size, 10);

      let entries = [];

      if (!isNaN(page) && !isNaN(size)) {
        entries = email
          ? await entryRepository.findAllPageable({ email }, page, size)
          : await entryRepository.findAllPageable({}, page, size);
        entries.content.map(entry => entry.serialise({ view: true }));
      } else {
        entries = [];
      }

      return res.json({ entry: entries });
    } catch (error) {
      return errorController(error, req, res);
    }
  },

  get: async (req, res) => {
    try {
      const entry = await entryRepository.findOne({ _id: new ObjectID(req.params.id) });
      return res.json(entry.serialise({ view: true }));
    } catch (error) {
      return errorController(error, req, res);
    }
  },

  post: async (req, res) => {
    try {
      const entry = new Entry(req.body);
      const entrySaved = await entryRepository.save(entry);
      res.header('Location', `/entry/${entrySaved.id}`);
      return res.status(201).json(entry.serialise({ view: true }));
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
      await entryRepository.delete({ _id: new ObjectID(req.params.id) });
      return res.status(204).send();
    } catch (error) {
      return errorController(error, req, res);
    }
  },
};

module.exports = EntryController;
