export class RequiredPropsError extends Error {
  /**
   * @param {String} message
   * @param {String} propName
   */
  constructor(message, propName) {
    super(message);
    this.propName = propName;
  }
}

export class DataAccessError extends Error {
  /**
   * @param {String} message
   * @param {String} entity
   */
  constructor(message, entity) {
    super(message);
    this.entity = entity;
  }
}
