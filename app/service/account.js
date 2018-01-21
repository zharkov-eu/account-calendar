import Account from '../domain/account';
import MongoRepository from '../repository/mongodb';
import { RequiredPropsError } from '../error';

const accountRepository = new MongoRepository(Account, 'account');

const AccountService = {
  create: ({ email, name, phone, note }) => {
    const account = new Account({ email, name, phone, note });
    return accountRepository.save(account);
  },

  update: (accountUpdate) => {
    if (!accountUpdate.email) throw new RequiredPropsError('Must specify email on update query', 'email');

    const account = accountRepository.findOne({ email: accountUpdate.email });
    const accountUpdated = new Account(Object.assign({}, account, accountUpdate));
    return accountRepository.update(
      { email: accountUpdate.email },
      Object.assign({}, account, accountUpdated),
    );
  },

  findOne: ({ query }) => accountRepository.findOne(query),

  findAllPageable: ({ page, size }) => accountRepository.findAllPageable({}, page, size),

  delete: ({ email }) => accountRepository.delete({ email }),
};

module.exports = AccountService;
