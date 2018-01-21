const assert = require('assert');
const Interval = require('../../../app/domain/model/interval');

describe('Вспомогательный класс: Interval', () => {
  const start = new Date();
  start.setFullYear(2018, 0, 25);
  start.setHours(10, 0, 0);
  const end = new Date(Date.parse(start.toISOString()));
  end.setHours(22, 30, 0);

  it('Сериализация работает корректно для корректных значений даты', () => {
    const interval = new Interval(start, end);
    assert.strictEqual(interval.serialize(), '10:00-22:30', 'Некорректная сериализация');
  });

  it('Десериализация работает корректно для корректных значений даты', () => {
    const interval = Interval.deserialize(start, '10:00-22:30');
    assert.strictEqual(interval.start.getFullYear(), 2018, 'Некорректная десериализация года');
    assert.strictEqual(interval.start.getMonth(), 0, 'Некорректная десериализация месяца');
    assert.strictEqual(interval.start.getDate(), 25, 'Некорректная десериализация дня');
    assert.strictEqual(interval.start.getHours(), 10, 'Некорректная десериализация часа, начало');
    assert.strictEqual(interval.start.getMinutes(), 0, 'Некорректная десериализация минут, начало');
    assert.strictEqual(interval.end.getHours(), 22, 'Некорректная десериализация часа, конец');
    assert.strictEqual(interval.end.getMinutes(), 30, 'Некорректная десериализация минут, конец');
    assert.strictEqual(interval.start.getDate() === interval.end.getDate(), true, 'Начало и конец интервала - не один день');
  });
});
