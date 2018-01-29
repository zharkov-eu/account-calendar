const errors = require('../error');
const {errorResponse} = require('../controller/error');

function errorHandler() {
  return (err, req, res, next) => {
    console.log(err.message);

    if (err instanceof errors.RequiredPropsError) {
      return errorResponse(400, err, req, res);
    } else if (err instanceof errors.EntityNotFoundError) {
      return errorResponse(404, err, req, res);
    }
    return errorResponse(500, err, req, res);
  };
}

module.exports = errorHandler;
