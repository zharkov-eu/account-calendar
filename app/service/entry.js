import Entry from '../domain/entry';
import MongoRepository from '../repository/mongo';
import { RequiredPropsError } from '../error';

const entryRepository = new MongoRepository(Entry, 'entry');

const EntryService = {
  findAllByEmail: ({ page, size }) => entryRepository.findAllPageable({}, page, size),
};

export default EntryService;
