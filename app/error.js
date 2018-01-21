exports.RequiredPropsError = class RequiredPropsError extends Error {
  /**
   * @param {String} message
   * @param {String} propName
   */
  constructor(message, propName) {
    super(message);
    this.propName = propName;
  }
};

exports.DataAccessError = class DataAccessError extends Error {
  /**
   * @param {String} message
   * @param {String} entity
   */
  constructor(message, entity) {
    super(message);
    this.entity = entity;
  }
};

exports.EntityNotFoundError = class EntityNotFoundError extends Error {
  /**
   * @param {Object} query
   */
  constructor(query) {
    const message = `Entity by query = ${JSON.stringify(query)} not found`;
    super(message);
    console.error(message);
    this.query = query;
  }
};
