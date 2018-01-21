import Entry from '../domain/entry';
import MongoRepository from '../repository/mongodb';
import { RequiredPropsError } from '../error';

const entryRepository = new MongoRepository(Entry, 'entry');

const EntryService = {
  findAllByEmail: ({ page, size }) => entryRepository.findAllPageable({}, page, size),
};

export default EntryService;
