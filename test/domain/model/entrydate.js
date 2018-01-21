const assert = require('assert');
const EntryDate = require('../../../app/domain/model/entrydate');

describe('Вспомогательный класс: EntryDate', () => {
  const date = new Date();
  date.setFullYear(2018, 0, 25);

  it('Конструктор выбрасывает исключение при некорректном объекте даты', () => {
    assert.throws(() => (new EntryDate('NotDate')), Error);
  });

  it('Сериализация работает корректно для корректных значений даты', () => {
    const entryDate = new EntryDate(date);
    assert.strictEqual(entryDate.serialize(), '2018-01-25', 'Некорректная сериализация');
  });

  it('Десериализация работает корректно для корректных значений даты', () => {
    const entryDate = EntryDate.deserialize('2018-01-25');
    assert.strictEqual(entryDate.date.getFullYear(), 2018, 'Некорректная десериализация года');
    assert.strictEqual(entryDate.date.getMonth(), 0, 'Некорректная десериализация месяца');
    assert.strictEqual(entryDate.date.getDate(), 25, 'Некорректная десериализация дня');
  });
});
