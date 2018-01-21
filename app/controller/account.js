const { ObjectID } = require('mongodb');
const Account = require('../domain/account');
const errorController = require('./error');
const MongoRepository = require('../repository/mongodb');

const accountRepository = new MongoRepository(Account, 'account');

const AccountController = {

  getAll: async (req, res) => {
    try {
      const email = req.query.email;
      const page = parseInt(req.query.page, 10);
      const size = parseInt(req.query.size, 10);

      let accounts = {};

      if (email) {
        accounts = (await accountRepository.findOne({ email })).serialise();
      } else if (!isNaN(page) && !isNaN(size)) {
        accounts = await accountRepository.findAllPageable({}, page, size);
        accounts.content = accounts.content.map(account => account.serialise());
      } else {
        accounts = (await accountRepository.findAll({}))
          .map(account => account.serialise());
      }

      return res.json({ account: accounts });
    } catch (error) {
      return errorController(error, req, res);
    }
  },

  get: async (req, res) => {
    try {
      const account = await accountRepository.findOne({_id: new ObjectID(req.params.id)});
      return res.json(account.serialise());
    } catch (error) {
      return errorController(error, req, res);
    }
  },

  post: async (req, res) => {
    try {
      const account = new Account(req.body);
      const accountSaved = await accountRepository.save(account);
      res.header('Location', `/account/${accountSaved.id}`);
      return res.status(201).json(accountSaved.serialise());
    } catch (error) {
      return errorController(error, req, res);
    }
  },

  patch: async (req, res) => {
    try {
      const account = new Account({
        ...(await accountRepository.findOne({ _id: new ObjectID(req.params.id) })),
        ...req.body,
      }, { propsUnchecked: true });

      const accountUpdate = await accountRepository.update(
        { _id: new ObjectID(req.params.id) },
        account,
      );
      return res.json(accountUpdate.serialise());
    } catch (error) {
      return errorController(error, req, res);
    }
  },

  delete: async (req, res) => {
    try {
      await accountRepository.delete({ _id: new ObjectID(req.params.id) });
      return res.status(204).send();
    } catch (error) {
      return errorController(error, req, res);
    }
  },
};

module.exports = AccountController;
