const { ObjectID } = require('mongodb');
const Entry = require('../domain/entry');
const {MongoRepository} = require('../repository/mongo');

const entryRepository = new MongoRepository(Entry, 'entry');

const EntryController = {

  getAll: async (req, res) => {
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
  },

  get: async (req, res) => {
    const entry = await entryRepository.findOne({ _id: new ObjectID(req.params.id) });
    return res.json(entry.serialise({ view: true }));
  },

  post: async (req, res) => {
    const entry = new Entry(req.body);
    const entrySaved = await entryRepository.save(entry);
    res.header('Location', `/entry/${entrySaved.id}`);
    return res.status(201).json(entry.serialise({ view: true }));
  },

  patch: async (req, res) => {
    return res.json({ });
  },

  delete: async (req, res) => {
    await entryRepository.delete({ _id: new ObjectID(req.params.id) });
    return res.status(204).send();
  },
};

module.exports = EntryController;
