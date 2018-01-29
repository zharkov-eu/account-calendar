const { ObjectID } = require('mongodb');
const Account = require('../domain/account');
const {MongoRepository} = require('../repository/mongo');

const accountRepository = new MongoRepository(Account, 'account');

const AccountController = {

  getAll: async (req, res) => {
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
  },

  get: async (req, res) => {
    const account = await accountRepository.findOne({_id: new ObjectID(req.params.id)});
    return res.json(account.serialise());
  },

  post: async (req, res) => {
    const account = new Account(req.body);
    const accountSaved = await accountRepository.save(account);
    res.header('Location', `/account/${accountSaved.id}`);
    return res.status(201).json(accountSaved.serialise());
  },

  patch: async (req, res) => {
    const account = new Account({
      ...(await accountRepository.findOne({ _id: new ObjectID(req.params.id) })),
      ...req.body,
    }, { propsUnchecked: true });

    const accountUpdate = await accountRepository.update(
      { _id: new ObjectID(req.params.id) },
      account,
    );
    return res.json(accountUpdate.serialise());
  },

  delete: async (req, res) => {
    await accountRepository.delete({ _id: new ObjectID(req.params.id) });
    return res.status(204).send();
  },
};

module.exports = AccountController;
